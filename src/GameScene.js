var tipoSuelo = 1;
var tipoJugador = 2;
var tipoMoneda = 3;
var tipoEnemigo = 4;

var GameLayer = cc.Layer.extend({
    space: null,
    jugador: null,
    mapa: null,
    mapaAncho: null,
    monedas: [],
    enemigos: [],
    pinchos: [],
    formasEliminar: [],
    _emitter: null,
    tiempoEfecto: 0,
    ctor: function () {
        this._super();
        var size = cc.winSize;

        // CACHE
        cc.spriteFrameCache.addSpriteFrames(res.moneda_plist);
        cc.spriteFrameCache.addSpriteFrames(res.jugador_subiendo_plist);
        cc.spriteFrameCache.addSpriteFrames(res.jugador_avanzando_plist);
        cc.spriteFrameCache.addSpriteFrames(res.animacion_cuervo_plist);
        cc.spriteFrameCache.addSpriteFrames(res.animacion_pincho_plist);

        // Inicializar Space
        this.space = new cp.Space();
        this.space.gravity = cp.v(0, -350);
        // Depuración
        this.depuracion = new cc.PhysicsDebugNode(this.space);
        this.addChild(this.depuracion, 10);

        // suelo y jugador
        this.space.addCollisionHandler(tipoSuelo, tipoJugador,
            null, null, this.collisionSueloConJugador.bind(this), null);

        // jugador y moneda
        // IMPORTANTE: Invocamos el método antes de resolver la colisión
        // (realmente no habrá colisión por la propiedad SENSOR de la Moneda).
        this.space.addCollisionHandler(tipoJugador, tipoMoneda,
            null, this.collisionJugadorConMoneda.bind(this), null, null);

        // Jugador y enemigos
        this.space.addCollisionHandler(tipoJugador, tipoEnemigo,
            null, this.collisionJugadorConEnemigo.bind(this), null, null);


        this.jugador = new Jugador(this, cc.p(50, 150));
        this.cargarMapa();
        this.scheduleUpdate();

        // Declarar emisor de particulas (parado)
        this._emitter = new cc.ParticleGalaxy.create();
        this._emitter.setEmissionRate(0);
        //this._emitter.texture = cc.textureCache.addImage(res.fire_png);
        this._emitter.shapeType = cc.ParticleSystem.STAR_SHAPE;
        this.addChild(this._emitter, 10);

        return true;
    }, update: function (dt) {
        this.jugador.estado = estadoSaltando;
        this.space.step(dt);

        for (var i = 0; i < this.enemigos.length; i++) {
            this.enemigos[i].update(dt, this.jugador.body.p.x);
        }

        // Control de emisor de partículas
        if (this.tiempoEfecto > 0) {
            this.tiempoEfecto = this.tiempoEfecto - dt;
            this._emitter.x = this.jugador.body.p.x;
            this._emitter.y = this.jugador.body.p.y;

        }
        if (this.tiempoEfecto < 0) {
            this._emitter.setEmissionRate(0);
            this.tiempoEfecto = 0;
        }

        // Controlar el angulo (son radianes) max y min.
        if (this.jugador.body.a > 0.44) {
            this.jugador.body.a = 0.44;
        }
        if (this.jugador.body.a < -0.44) {
            this.jugador.body.a = -0.44;
        }

        if (this.jugador.body.vx < 250) {
            this.jugador.body.applyImpulse(cp.v(300, 0), cp.v(0, 0));
        }
        if (this.jugador.body.vx > 400) {
            this.jugador.body.vx = 400;
        }
        // controlar la velocidad Y , max
        if (this.jugador.body.vy > 450) {
            this.jugador.body.vy = 450;
        }

        // actualizar cámara (posición de la capa).
        var posicionXJugador = this.jugador.body.p.x - 200;
        var posicionYJugador = this.jugador.body.p.y - 200;
        this.setPosition(cc.p(-posicionXJugador, -posicionYJugador));

        // Caída, sí cae vuelve a la posición inicial
        if (this.jugador.body.p.y < -100) {
            this.jugador.body.p = cc.p(50, 150);
            this.jugador.reiniciarAceleraciones();
        }

        // Eliminar formas:
        for (var i = 0; i < this.formasEliminar.length; i++) {
            var shape = this.formasEliminar[i];

            for (var i = 0; i < this.monedas.length; i++) {
                if (this.monedas[i].shape == shape) {
                    this.monedas[i].eliminar();
                    this.monedas.splice(i, 1);
                }
            }
        }
        this.formasEliminar = [];


    }, cargarMapa: function () {
        this.mapa = new cc.TMXTiledMap(res.mapa1_tmx);
        // Añadirlo a la Layer
        this.addChild(this.mapa);
        // Ancho del mapa
        this.mapaAncho = this.mapa.getContentSize().width;

        // Solicitar los objeto dentro de la capa Suelos
        var grupoSuelos = this.mapa.getObjectGroup("Suelos");
        var suelosArray = grupoSuelos.getObjects();

        // Los objetos de la capa suelos se transforman a
        // formas estáticas de Chipmunk ( SegmentShape ).
        for (var i = 0; i < suelosArray.length; i++) {
            var suelo = suelosArray[i];
            var puntos = suelo.polylinePoints;
            for (var j = 0; j < puntos.length - 1; j++) {
                var bodySuelo = new cp.StaticBody();

                var shapeSuelo = new cp.SegmentShape(bodySuelo,
                    cp.v(parseInt(suelo.x) + parseInt(puntos[j].x),
                        parseInt(suelo.y) - parseInt(puntos[j].y)),
                    cp.v(parseInt(suelo.x) + parseInt(puntos[j + 1].x),
                        parseInt(suelo.y) - parseInt(puntos[j + 1].y)),
                    10);
                shapeSuelo.setCollisionType(tipoSuelo);
                this.space.addStaticShape(shapeSuelo);
            }
        }

        // Monedas
        var grupoMonedas = this.mapa.getObjectGroup("Monedas");
        var monedasArray = grupoMonedas.getObjects();
        for (var i = 0; i < monedasArray.length; i++) {
            var moneda = new Moneda(this,
                cc.p(monedasArray[i]["x"], monedasArray[i]["y"]));
            this.monedas.push(moneda);
        }

        // Enemigos
        var grupoEnemigos = this.mapa.getObjectGroup("Enemigos");
        var enemigosArray = grupoEnemigos.getObjects();
        for (var i = 0; i < enemigosArray.length; i++) {
            var enemigo = new Enemigo(this,
                cc.p(enemigosArray[i]["x"], enemigosArray[i]["y"]));
            enemigo.shape.setCollisionType(tipoEnemigo);
            this.enemigos.push(enemigo);
        }

        // Pinchos
        var grupoPinchos = this.mapa.getObjectGroup("Pinchos");
        var pinchosArray = grupoPinchos.getObjects();
        for (var i = 0; i < pinchosArray.length; i++) {
            var pincho = new Pinchos(this,
                cc.p(pinchosArray[i]["x"], pinchosArray[i]["y"]));
            pincho.shape.setCollisionType(tipoEnemigo);
            this.pinchos.push(pincho);
        }
    }, collisionSueloConJugador: function (arbiter, space) {
        this.jugador.tocaSuelo();
    }, collisionJugadorConMoneda: function (arbiter, space) {

        // Emisión de partículas
        this._emitter.setEmissionRate(5);
        this.tiempoEfecto = 3;

        // Impulso extra
        this.jugador.body.applyImpulse(cp.v(300, 0), cp.v(0, 0));

        // Marcar la moneda para eliminarla
        var shapes = arbiter.getShapes();
        // shapes[0] es el jugador
        this.formasEliminar.push(shapes[1]);
    }, collisionJugadorConEnemigo: function (arbiter, space) {
        this.jugador.body.p = cc.p(50, 150);
        this.jugador.reiniciarAceleraciones();
    }

});

var idCapaJuego = 1;
var idCapaControles = 2;

var GameScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer, 0, idCapaJuego);

        var controlesLayer = new ControlesLayer();
        this.addChild(controlesLayer, 0, idCapaControles);

    }
});
