const client = require('./../connection');

exports.getIndex = async (req, res) => {
  //Delete index
  if (req.params.index) {
    await client.indices.delete({
      index: req.params.index,
    });

    // res.redirect('/index');
  }

  //Create index
  if (req.query.new_index) {
    let createString = req.query.new_index;
    createString = createString.split(' ').join('_');
    createString = `{"index":"${createString}"}`;

    await client.indices.create(JSON.parse(createString));
    // res.redirect('/index');
  }

  //Query index
  const indices = await client.indices.get({
    index: '_all',
  });

  let indicesString = [];

  for (const index in indices) {
    indicesString.push(index);
  }
  indicesString = indicesString.map((el) => el.split('_').join(' '));

  res.status(200).render('index', {
    title: 'Index',
    indicesString,
  });
};

exports.getDocument = async (req, res) => {
  //Delete document
  if (req.params.id) {
    await client.delete({
      index: req.params.index,
      id: req.params.id,
    });
    return res.redirect(req.get('referer'));
  }

  //Create document
  if (req.query.index) {
    let indexInput = req.query.index;
    let docidInput = req.query.docid;
    let nocInput = req.query.noc;
    let sexInput = req.query.sex;
    let cityInput = req.query.city;
    let weightInput = req.query.weight;
    let nameInput = req.query.name;
    let sportInput = req.query.sport;
    let gamesInput = req.query.games;
    let eventInput = req.query.event;
    let heightInput = req.query.height;
    let teamInput = req.query.team;
    let idInput = req.query.id;
    let medalInput = req.query.medal;
    let ageInput = req.query.age;

    let createString = `{"index":"${indexInput}","id":"${docidInput}","body":{"noc":"${nocInput}","sex":"${sexInput}","city":"${cityInput}","weight":"${weightInput}","name":"${nameInput}","sport":"${sportInput}","games":"${gamesInput}","event":"${eventInput}","height":"${heightInput}","team":"${teamInput}","id":"${idInput}","medal":"${medalInput}","age":"${ageInput}"}}`;

    await client.index(JSON.parse(createString));
    return res.redirect(req.get('referer'));
  }

  //Query document
  let query = {};

  if (Object.keys(req.query).length === 0) {
    query = { match_all: {} };
  } else {
    query = { match: req.query };
  }

  const documents = await client.search({
    index: req.params.index,
    body: {
      size: 100,
      query: query,
    },
  });

  let documentHits = documents.hits.hits;

  // const final = [];
  // documentHits.forEach((element) => {
  //   final.push(element._index);
  //   final.push(element._id);
  //   final.push(element._source);
  // });

  // let newData = [];
  // for (let i = 0; i < final.length; i += 3) {
  //   let three = [];
  //   three.push(final[i]);
  //   three.push(final[i + 1]);
  //   three.push(Object.keys(final[i + 2]).map((key) => final[i + 2][key]));

  //   newData.push(three);
  // }

  // for (let i = 0; i < newData.length; i++) {
  //   newData[i] = newData[i].flat();
  // }

  res.status(200).render('document', {
    title: 'Document',
    documentHits,
  });
};

exports.doSearch = async (req, res) => {
  let queryString = '';

  if (!req.query.query_string) {
    queryString = '';
  } else {
    queryString = req.query.query_string;
  }

  const documents = await client.search({
    index: req.params.index,
    body: {
      size: 100,
      query: {
        multi_match: {
          query: queryString,
          fields: ['*'],
        },
      },
    },
  });

  let documentHits = documents.hits.hits;
  // const final = [];
  // documentHits.forEach((element) => {
  //   final.push(element._index);
  //   final.push(element._id);
  //   final.push(element._source);
  // });

  // let newData = [];
  // for (let i = 0; i < final.length; i += 3) {
  //   let three = [];
  //   three.push(final[i]);
  //   three.push(final[i + 1]);
  //   three.push(Object.keys(final[i + 2]).map((key) => final[i + 2][key]));

  //   newData.push(three);
  // }

  // for (let i = 0; i < newData.length; i++) {
  //   newData[i] = newData[i].flat();
  // }
  res.status(200).render('search', {
    title: 'Search',
    documentHits,
  });
};
