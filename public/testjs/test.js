var http= require('http');
function handle_rquest(req,res){
    console.log(req.method+req.url);
    res.writeHead(200,{"Content-Type":"application/json"});
    res.end(JSON.stringify({error:null})+"\n");
}

var s = http.createServer(handle_rquest);
s.listen(8080);