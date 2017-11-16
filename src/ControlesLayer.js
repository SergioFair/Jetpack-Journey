

var ControlesLayer = cc.Layer.extend({
    spriteBotonSaltar: null,
    spriteBotonTurbo: null,
    ctor: function () {
        this._super();
        var size = cc.winSize;

        // BotonSaltar
        this.spriteBotonSaltar = cc.Sprite.create(res.boton_saltar_png);
        this.spriteBotonSaltar.setPosition(
            cc.p(size.width * 0.8, size.height * 0.5));

        this.addChild(this.spriteBotonSaltar);

        // BotonTurbo
        this.spriteBotonTurbo = cc.Sprite.create(res.boton_turbo_png);
        this.spriteBotonTurbo.setPosition(
            cc.p(size.width * 0.7, size.height * 0.3));

        this.addChild(this.spriteBotonTurbo);

        // Registrar Mouse Down
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseDown: this.procesarMouseDown
        }, this)

        this.scheduleUpdate();
        return true;
    }, update: function (dt) {

    }, procesarMouseDown: function (event) {
        var instancia = event.getCurrentTarget();
        var areaBotonSaltar = instancia.spriteBotonSaltar.getBoundingBox();
        var areaBotonTurbo = instancia.spriteBotonTurbo.getBoundingBox();
        var posicionXEvento = event.getLocationX(), posicionYEvento = event.getLocationY();

        // La pulsación cae dentro del botón
        if (cc.rectContainsPoint(areaBotonSaltar,
            cc.p(posicionXEvento, posicionYEvento))) {

            // Accedemos al padre (Scene), pedimos la capa con la idCapaJuego
            var gameLayer = instancia.getParent().getChildByTag(idCapaJuego);
            // tenemos el objeto GameLayer
            gameLayer.jugador.saltar();

        } else if (cc.rectContainsPoint(areaBotonTurbo
            , cc.p(posicionXEvento, posicionYEvento))){

                // Accedemos al padre (Scene), pedimos la capa con la idCapaJuego
                var gameLayer = instancia.getParent().getChildByTag(idCapaJuego);
                // tenemos el objeto GameLayer
                gameLayer.jugador.acelerar();
            }
    }
});
