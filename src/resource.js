var res = {
    HelloWorld_png : "res/HelloWorld.png",
    CloseNormal_png : "res/CloseNormal.png",
    CloseSelected_png : "res/CloseSelected.png",
    boton_jugar_png : "res/boton_jugar.png",
    menu_titulo_png : "res/menu_titulo.png",
    tiles32_png: "res/tiles32.png",
    mapa1_tmx: "res/mapa1.tmx",
    moneda_png : "res/moneda.png",
    moneda_plist : "res/moneda.plist",
    jugador_avanzando_png : "res/jugador_avanzando.png",
    jugador_avanzando_plist : "res/jugador_avanzando.plist",
    jugador_subiendo_png : "res/jugador_subiendo.png",
    jugador_subiendo_plist : "res/jugador_subiendo.plist",
    boton_saltar_png: "res/boton_saltar.png",
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}