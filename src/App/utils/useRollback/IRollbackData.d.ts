declare interface IFirebaseData {
    origin:string;
    collection:string;
    field:string;
    identifier:string;
}

declare interface IZoopData {
    origin:string;
    zoopId:string;
}

declare interface ISheetsData {
    origin:string;
    id:string;
    rangeToSearch:string;
    rangeToUpdate:string;
    spreadsheetId:string;
    values:Array<string>;
}

declare interface IUserData{
    origin:string;
    pass:string;
}

declare interface IApiData {
    origin:string;
    url:string;
    body:object;
    config:object;
}
