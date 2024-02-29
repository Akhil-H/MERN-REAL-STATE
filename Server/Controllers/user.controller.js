const express =require('express')

const test=(req,res)=>{
    // res.send('<h1>hello</h1>')
    res.send({
        message:"Hello Worls !"
    });
}
module.exports=test;