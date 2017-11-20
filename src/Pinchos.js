
var Pinchos = cc.Class.extend({
    gameLayer: null,
    sprite: null,
    shape: null,
    ctor: function (gameLayer, posicion) {

        this.gameLayer = gameLayer;
    
        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite(res.pinchos_png);

        // Cuerpo dinámico, SI le afectan las fuerzas
        this.body = new cp.Body(5, cp.momentForBox(1,
            this.sprite.getContentSize().width,
            this.sprite.getContentSize().height));

        this.body.setPos(posicion);
        this.body.setAngle(0);
        this.sprite.setBody(this.body);
        // Se añade el cuerpo al espacio
        gameLayer.space.addBody(this.body);

        // forma
        this.shape = new cp.BoxShape(this.body,
            this.sprite.getContentSize().width - 16,
            this.sprite.getContentSize().height - 16);

        // agregar forma estatica
        gameLayer.space.addStaticShape(this.shape);
        // añadir sprite a la capa

        gameLayer.addChild(this.sprite, 10);
    }
});