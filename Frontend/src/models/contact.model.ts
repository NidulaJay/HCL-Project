export class Contact {
    constructor(
        public Fname : string,
        public Lname : string|null,
        public email : string,
        public phonenumber : string,
        public description : string|null,
    ){}
}