const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.orf3svp.mongodb.net/phoneBookApp?retryWrites=true&w=majority&appName=Cluster0`
mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })

const phoneBookSchema = new mongoose.Schema({
  name: String,
  number: String,
  important: Boolean,
})

const PhoneBook = mongoose.model('PhoneBook', phoneBookSchema)
if (process.argv.length === 3) {
  PhoneBook.find({}).then(result => {
    result.forEach(entry => {
      console.log(entry)
    })
    mongoose.connection.close()
  })
} else {
    const phoneBookEntry = new PhoneBook({
    name: process.argv[3],
    number: process.argv[4],
    important: true,
    })

    phoneBookEntry.save().then(result => {
      console.log('phone book entry saved!')
      mongoose.connection.close()
    })
}