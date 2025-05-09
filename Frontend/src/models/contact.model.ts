export class Contact {
    constructor(
        public _id : string|null,
        public Fname : string,
        public Lname : string|null,
        public email : string,
        public phonenumber : string,
        public description : string|null,
        public status : boolean|null
    ){}
}