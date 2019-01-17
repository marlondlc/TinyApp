
///__________________________FrameWork _______________________________//
// express adds packages to build wed applications 

const express = require( "express" );
const app = express(); // this means the application is running with express NPM
const PORT = 8080; // default port 8080
const uuidv1 = require( "uuid/v1" ) //feature to gen random number

//__________________________MiddleWare_____________________________//
//middle ware definition = define app endpoints(uri's)//sends response back to the client // matches request routes using pattern expressions.
//bodyParser - allowing you to extract 
//set "View Engine" = set what kind of templete file to use (ex. html/ejs) this ex uses ejs
// MW - gives you an additon feature 
const bodyParser = require( "body-parser" ); // installed npm body-parser and linked it
app.use( bodyParser.urlencoded( { extended: true } ) );// methodes
app.set( "view engine", "ejs" ); // method


//__________________DataBase Obj (Dom used MovieQuoteDB)______________________//
//This is where you are pulling info (check with mentor)
// When sending variables to an EJS template, you need to send them inside an object, even if you are only sending one variable

var urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com",
};


//________________Functions-Below______________________________//

//below function as indicated will give you a random string of 6 random alpha characters
function generateRandomString ()
{
    //1st step - new to create an id: // short URL
    return uuidv1().substring( 0, 6 );
    //console.log( "ID", id )


}






//_____________________________________________________________//




//____________________________END POINTS - SENDING DATA "GET"________________________________________//
//Get =  route to show the form
//Render = "res.render" will send the OBJ we created to the EJS file (ex. "urls_index")
// struct = get / post / update / delete
app.get( "/urls", ( req, res ) =>
{
    let templateVars = { urls: urlDatabase };
    res.render( "urls_index", templateVars );


} );
//adding a GET route to show form
app.get( "/urls/new", ( req, res ) =>// give me the url_new (render below)
{
    res.render( "/urls_new" );

} );

app.get( "/urls/:id", ( req, res ) =>
{

    let templateVars = {
        longUrl: urlDatabase[ req.params.id ],
        //long url is trying to access  the [] in this ex. "http://www.lighthouselabs.ca" 
        //[] = OBJECT [key] returns value- "http://...""

        shortUrl: req.params.id
    };
    //[ req.params.id ] -- gives you back the id within the obj indicated before
    //console.log( urlDatabase[ req.params.id ] )
    res.render( "urls_show", templateVars );
    console.log( templateVars );
} );

app.get( "/", ( req, res ) =>
{
    res.send( "Hello!" );
} );

app.get( "/urls.json", ( req, res ) =>
{
    res.json( urlDatabase );
} );
app.get( "/hello", ( req, res ) =>
{
    res.send( "<html><body>Hello <b>World</b></body></html>\n" );
} );

app.post( "/urls", ( req, res ) =>
{
    let rNumber = generateRandomString();
    //console.log( req.body );  // debug statement to see POST parameters
    urlDatabase[ rNumber ] = req.body.longURL;
    console.log( urlDatabase )
    res.redirect( '/urls' ); // redirect you back to the home page. (ex "/url = home page ")
} );

app.post( "/urls/:id/delete", ( req, res ) =>
{
    delete urlDatabase[ req.params.id ] //
    res.redirect( '/urls' ); // redirect you back to the home page. (ex "/url = home page ")

} );

app.post( '/urls/:id/update', ( req, res ) =>
{
    let templateVars = { longURL: urlDatabase[ req.params.id ], shortURL: req.params.id };
    res.render( "shortUrl", templateVars )
} )
// app.post( '/urls/:id/edit', ( req, res ) =>
// {
//     let templateVars = { longURL: urlDatabase[ req.params.id ], shortURL: req.params.id };
//     res.direct( "longUrl", templateVars )


// } )

app.listen( PORT, () =>
{
    console.log( `Example app listening on port ${ PORT }!` );
}
);

//________________________________________________________________________________//



// post request --

//_______________________QUESTIONS____________________________________//
//In Express, when an EJS template is rendered using res.render(), the EJS is evaluated on the server or client?
//ANSWER: On the server, before the HTTP response gets sent to the client
//________although possible to render client-side templates, we use it as a 
//________server-side technology. ALSO /Either server or client, but it's predominantly found server-side
//________although possible to render client - side templates with EJS, that is not how we will be using it

//Q2-How are Arrow Functions () => {} different than traditional function expressions?
//ANWSER - arrow functions inherit parent scope // they do no declare the functions

//Q3 - Considering the following JavaScript code, what will the console output be and why?
//ANSWER:
// function foo() {
//     var x = 1;
//     if (x === 1) {
//       let y = 2;
//     }
//     console.log('Value of y is ' + y);
//   }
//   foo();
//ANSWER : ReferenceError
//the block-scoping of let y = 2 makes it available only within the if statement block

//Q4 - Consider the following JavaScript code, what would be the console output?
//ANSWER:
// const names = ['Graham'];
// names = [];
// console.log(names)
//Console would show a TypeError----Assignment to constant variable. due to the declaration using const

//Q5 - Given the following JavaScript code, what would be the console output?
//
//ANSWER:
// const names = [];
// names.push('Jordan');
// console.log( names );
//Console would show ['Jordan'] -it still allows us to change the value of the referenced variable