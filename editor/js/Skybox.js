import { Object3D, BoxBufferGeometry, MeshBasicMaterial, TextureLoader, BackSide, Mesh } from "../../build/three.module.js";

export default class SkyBox extends Object3D {
    constructor() {
        super()
        this.create()
    }

    create() {
        this.name = 'sky'
        this.textureLoader = new TextureLoader().setPath('images/')
        this.textures = { 'none': null }
        this.materials = { 'none': new MeshBasicMaterial() }

        this.obj = new Mesh(
            new BoxBufferGeometry(1800, 1800, 1800),
            this.getMaterial('none')
        )
        this.add(this.obj)
    }

    async loadTexture(type) {
        this.textures[type] = {}
        const faces = ['ft', 'bk', 'up', 'dn', 'rt', 'lf']
        for (const face of faces) {
            this.textures[type][face] = await this.textureLoader.loadAsync(
                `skybox/${type}_${face}.jpg`
            )
        }
    }

    getTexture(type) {
        return this.textures[type]
    }

    loadMaterial(type) {
        const textures = this.getTexture(type)

        this.materials[type] = Object.values(textures).map((texture) => {
            return new MeshBasicMaterial({ map: texture, side: BackSide })
        })
    }

    getMaterial(type) {
        return this.materials[type]
    }

    async loadSky(type) {
        this.userData.type = type
        if (!this.getTexture(type)) await this.loadTexture(type)
        if (!this.getMaterial(type)) this.loadMaterial(type)

        this.obj.material = this.getMaterial(type)
    }
}