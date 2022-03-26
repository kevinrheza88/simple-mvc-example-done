const models = require('../models');

const { Cat } = models;
const { Dog } = models;

const defaultData = {
    name: 'unknown',
    bedsOwned: 0,
};

const defaultDogData = {
    name: 'unknown',
    breed: 'unknown',
    age: 0,
};

let lastAdded = new Cat(defaultData);
let lastDogAdded = new Dog(defaultDogData);

const hostIndex = (req, res) => {

    res.render('index', {
        currentName: lastAdded.name,
        title: 'Home',
        pageName: 'Home Page',
    });
};


const hostPage1 = async (req, res) => {

    try {

        const docs = await Cat.find({}).lean().exec();

        return res.render('page1', { cats: docs });
    } catch (err) {

        console.log(err);
        return res.status(500).json({ error: 'failed to find cats' });
    }
};

const hostPage2 = (req, res) => {
    res.render('page2');
};

const hostPage3 = (req, res) => {
    res.render('page3');
};

const hostPage4 = async (req, res) => {
    try {
        const docs = await Dog.find({}).lean().exec();

        return res.render('page4', { dogs: docs });
    } catch (err) {

        console.log(err);
        return res.status(500).json({ error: 'failed to find dogs' });
    }
};

const getName = (req, res) => res.json({ name: lastAdded.name });

const setName = async (req, res) => {

    if (!req.body.firstname || !req.body.lastname || !req.body.beds) {

        return res.status(400).json({ error: 'firstname, lastname and beds are all required' });
    }

    const catData = {
        name: `${req.body.firstname} ${req.body.lastname}`,
        bedsOwned: req.body.beds,
    };

    const newCat = new Cat(catData);

    try {

        await newCat.save();

        lastAdded = newCat;
        return res.json({
            name: lastAdded.name,
            beds: lastAdded.bedsOwned,
        });
    } catch (err) {

        console.log(err);
        return res.status(500).json({ error: 'failed to create cat' });
    }
};

const setDogName = async (req, res) => {

    if (!req.body.firstname || !req.body.breed || !req.body.age) {

        return res.status(400).json({ error: 'firstname, breed and age are all required' });
    }


    const dogData = {
        name: `${req.body.firstname}`,
        breed: `${req.body.breed}`,
        age: req.body.age,
    };

    const newDog = new Dog(dogData);

    try {

        await newDog.save();

        lastDogAdded = newDog;
        return res.json({
            name: lastDogAdded.name,
            breed: lastDogAdded.breed,
            age: lastDogAdded.age
        });

    } catch (err) {

        console.log(err);
        return res.status(500).json({ error: 'failed to create dog' });
    }
};

const searchName = async (req, res) => {

    if (!req.query.name) {
        return res.status(400).json({ error: 'Name is required to perform a search' });
    }

    try {

        const doc = await Cat.findOne({ name: req.query.name }).exec();

        if (!doc) {
            return res.json({ error: 'No cats found' });
        }

    } catch (err) {

        console.log(err);
        return res.status(500).json({ error: 'Something went wrong' });
    }
    return res.json({ name: doc.name, beds: doc.bedsOwned });
};

const increaseByName = async (req, res) => {

    if (!req.body.name) {
        return res.status(400).json({ error: 'Name is required to perform a search' });
    }
    try {
        const doc = await Dog.findOne({ name: req.body.name }).exec();

        if (!doc) {
            return res.json({ error: 'No dogs found' });
        }

        doc.age++;
        const savePromise = doc.save();

        savePromise.then(() => res.json({
            name: doc.name,
            breed: doc.breed,
            age: doc.age
        }));

    } catch (err) {

        console.log(err);
        return res.status(500).json({ error: 'Something went wrong' });
    }

};

const updateLast = (req, res) => {

    lastAdded.bedsOwned++;

    const savePromise = lastAdded.save();

    savePromise.then(() => res.json({
        name: lastAdded.name,
        beds: lastAdded.bedsOwned,
    }));

    savePromise.catch((err) => {
        console.log(err);
        return res.status(500).json({ error: 'Something went wrong' });
    });
};

const notFound = (req, res) => {
    res.status(404).render('notFound', {
        page: req.url,
    });
};

module.exports = {
    index: hostIndex,
    page1: hostPage1,
    page2: hostPage2,
    page3: hostPage3,
    page4: hostPage4,
    getName,
    setName,
    setDogName,
    updateLast,
    searchName,
    increaseByName,
    notFound,
};
