const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('give password as argument');
    process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://cbojio432:${password}@fullstack.fd7x33p.mongodb.net/`;
mongoose.set('strictQuery', false);
mongoose.connect(url);


const personSchema = new mongoose.Schema({
    id: String,
    name: {
        type: String,
        minLength: 3,
        required: [true, 'Name is requiered!']
    },
    number: {
        type: String,
        validate: {
            validator: function (value) {
                // Проверка формата номера телефона
                // Допустимые форматы: "09-1234556" или "040-22334455"
                return /^\d{2,3}-\d{7,8}$/.test(value);
            },
            message: props => `${props.value} не является действительным номером телефона!  Допустимые форматы: "09-1234556" или "040-22334455"`
        },
        required: [true, 'Number is requiered!']
    },
});

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})
module.exports = mongoose.model('Person', personSchema);