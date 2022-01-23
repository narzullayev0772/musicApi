// const axios = require('axios').default
// const Music = require('./models/musicModel');
// const params = new URLSearchParams()
// params.append('query', 'Популярная музыка')

// const config = {
//   headers: {
//     'Content-Type': 'application/x-www-form-urlencoded'
//   }
// }

// axios.post("https://t9music.ru/upsearch/50", params, config)
//   .then(({data}) => {
//     Music.insertMany(...data.list)
//   })
//   .catch((err) => {
//     console.log("error connection");
//   })