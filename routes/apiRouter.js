const express= require('express');
const api= express.Router();
var fs = require('fs');


api.get('/lessons', (req, res) => {
	fs.readFile('./product.json', 'utf8', (err, jsonString) => {
		if (err) {
			console.log("Error reading file from disk:", err)
			return
		}
		try {
			const lessons = JSON.parse(jsonString)
            
			res.send(lessons)
      
           
		} catch(err) {
			console.log('Error parsing JSON string:', err)
		}
	})
});
// api.get('/user', (req, res) => {
// 	fs.readFile('./users.json', 'utf8', (err, jsonString) => {
// 		if (err) {
// 			console.log("Error reading file from disk:", err)
// 			return
// 		}
// 		try {
// 			const users = JSON.parse(jsonString)
            
// 			res.send(users)
      
           
// 		} catch(err) {
// 			console.log('Error parsing JSON string:', err)
// 		}
// 	})
// });


module.exports=api;
