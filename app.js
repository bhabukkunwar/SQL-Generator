const array = ['string1', 'string23']

const btn = document.body.querySelector('button')

const file = document.getElementById('file')

const output = document.getElementById('output')

let query

const funcrender = (e) => {
  e.preventDefault()
  output.textContent = query
}

btn.addEventListener('click', funcrender)

file.addEventListener('change', function (e) {
  const reader = new FileReader()
  const [file] = e.target.files
  console.log(file)

  reader.addEventListener('load', () => {
    query = reader.result
    console.log(query)
  })

  if (file) {
    reader.readAsText(file)
  }
})
