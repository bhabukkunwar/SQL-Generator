const array = ['string1', 'string23']

const btn = document.body.querySelector('button')

const file = document.getElementById('file')

const output = document.getElementById('output')

let counter = 0,
  bracket
let fileString, appender, query, colname, pkconst

pkconst = ''
colname = ''
bracket = false

const funcrender = (e) => {
  e.preventDefault()
  queryGen()
}

btn.addEventListener('click', funcrender)

file.addEventListener('change', function (e) {
  const reader = new FileReader()
  const [file] = e.target.files
  console.log(file)

  reader.addEventListener('load', () => {
    fileString = reader.result
  })

  if (file) {
    reader.readAsText(file)
  }
})

function queryGen() {
  query = 'create table ' + 'tablename' + '( \n'
  for (let i = 0; i < fileString.length; i++) {
    // reading each letter from fileString

    // console.log(query)
    appender = fileString.substring(i, i + 1)
    // console.log(appender)
    // console.log(counter)

    if (appender == ',' && bracket == false) {
      counter += 1
      query = query + ' '
      // query_rej = query_rej + ' '
    } else if (counter == 1) {
      if (appender == 'Y') {
        if (pkconst == '') {
          pkconst = colname
        } else {
          pkconst = pkconst + ', ' + colname
        }
      } else if (appender == ',') {
        query = query + ' ' + appender
        // query_rej = query_rej + ' ' + appender
      } else if (appender == ' ') {
        query = query + ' ' + appender
        // query_rej = query_rej + ' ' + appender
      } else {
        counter += 1
      }
    } else if (counter == 3) {
      if (appender == 'N') {
        query = query + ' NOT NULL' + ','
        // query_rej = query_rej + ' NOT NULL' + ','
        counter = 0
        colname = ''
      } else {
        query = query + ',\n'
        // query_rej = query_rej + ',\n'
        colname = ''
        counter = 0
      }
    } else if (appender == '(') {
      // console.log(bracket);
      bracket = true
      // console.log(bracket);
      query = query + appender
      // query_rej = query_rej + appender
    } else if (appender == ')') {
      bracket = false
      query = query + appender
      // query_rej = query_rej + appender
    } else {
      query = query + appender
      // query_rej = query_rej + appender
      // console.log(query)
      colname = colname + appender
      // console.log(colname);
    }
  }
  query =
    query + 'CONSTRAINT ' + 'tablename' + '_PK1 PRIMARY KEY (' + pkconst + ')'
  query = query + ')'

  output.textContent = query
}
