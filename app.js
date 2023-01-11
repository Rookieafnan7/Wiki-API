const express = require("express");
const bodyParser = require("body-parser");
const { default: mongoose } = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static("public"));
mongoose.set("strictQuery",false);

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const articleSchema = new mongoose.Schema({
    title:String,
    content:String
});

const article = new mongoose.model("article",articleSchema);


// let article1 = new article({
//     title:"Test1",
//     content:"blablablablablabalbalbab"
// })

// article1.save();
app.get("/",function(req,res){
    res.send("Shit happened!")
});

app.route("/articles")
    .get(function(req,res){
    {
        article.find({},function(err,foundArticles){
            if(!err){
                res.send(foundArticles);
            }else{
                res.send(err);
            }
        })
        // res.redirect("/");
    }
}).post(function(req,res){
    const postArticle = new article({
        title:req.body.title,
        content:req.body.content
    })
    postArticle.save(function(err){
        if(!err){
            res.send("Worked!");
        }else{
            console.log(err);
        }
    });
    
}).delete(function(req,res){
    article.deleteMany({},function(err){
        if(!err){
            console.log("All articles deleted successfully!");
            res.send("Lesgoo!")
        }else{
            console.log(err);
        }
    })
})

app.route("/articles/:parameter")
    .get(function(req,res){
        const articleName = req.params.parameter;
        article.findOne({title:articleName},function(err,foundArticle){
            if(!err){
                console.log(foundArticle);
                res.send(foundArticle);
            }else{
                console.log(err);
            }
        })
    }).put(function(req,res){
        const articleName = req.params.parameter;
        // const updateTitle = req.body.title;
        // const updateContent = req.
        let newArticle = new article({
            title:req.body.title,
            content:req.body.content
        })
        console.log(req.params.parameter,newArticle);
        article.findOneAndReplace({title:articleName},
            {
                title:req.body.title,
                content:req.body.content
            },{new:true},
                function(err,foundArticle){
                if(!err){
                    console.log(foundArticle);
                    res.send("Successfully updated article");
                }else{
                 console.log(err);   
                 res.send("An error occured.");
                }
            })
    }).patch(function(req,res){
        const articleName = req.params.parameter;
        console.log(articleName);
        article.findOneAndUpdate({title:articleName},
            {
                title:req.body.title,
                content: req.body.content
            },function(err){
                if(err){
                    console.log(err);
                    res.send("An error occured.");
                }else{
                    res.send("Successfully patched");
                }
            })
    }).delete(function(req,res){
        article.deleteOne({title:req.params.parameter},function(err){
            if(err){
                console.log(err);
                res.send("An error occured.");
            }else{
                res.send("Successfully deleted the article!");
            }
        })
    })

app.listen(3000,function(){
    console.log("Server started at port 3000");

})