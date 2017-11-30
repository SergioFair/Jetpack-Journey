
var Pinchos = cc.Class.extend({
    gameLayer: null,
    sprite: null,
    shape: null,
    ctor: function (gameLayer, posicion) {

        this.gameLayer = gameLayer;

        // Crear animación
        var framesAnimacion = [];
        for (var i = 1; i <= 8; i++) {
            var str = "pincho" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        var actionAnimacionBucle =
            new cc.RepeatForever(new cc.Animate(animacion));

        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite("#pincho1.png");

        // Cuerpo estático, NO le afectan las fuerzas
        this.body = new cp.StaticBody();

        this.body.setPos(posicion);
        this.sprite.setBody(this.body);
        // Los cuerpos estáticos nunca se añaden al Space
        var radio = this.sprite.getContentSize().width / 2;

        // forma
        this.shape = new cp.BoxShape(this.body,
            this.sprite.getContentSize().width - 16,
            this.sprite.getContentSize().height - 16);

        this.shape.setCollisionType(tipoEnemigo);

        // agregar forma estatica
        gameLayer.space.addStaticShape(this.shape);

        // ejecutar la animación
        this.sprite.runAction(actionAnimacionBucle);

        // añadir sprite a la capa
        gameLayer.addChild(this.sprite, 10);
    }
});