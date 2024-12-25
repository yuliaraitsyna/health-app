class Slide {
    private _id: number;
    private _name: string;
    private _description: string;
    private _image: string;
    private _url: string;

    constructor(id: number, name: string, description: string, image: string, url: string) {
        this._id = id;
        this._name = name;
        this._description = description;
        this._image = image;
        this._url = url;
    }

    get id(): number {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get description(): string {
        return this._description;
    }

    get image(): string {
        return this._image;
    }

    get url(): string {
        return this._url;
    }

}

export { Slide }
