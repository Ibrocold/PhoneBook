import { useState,useEffect } from 'react'
import phoneBook from '../services/phonebook'

const Filter = ({persons,typed,handleFilter}) => {
  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(typed.toLowerCase()));
  return(
      <div>
        filter shown with <input value={typed} onChange={handleFilter}/>
        {filteredPersons.map(person => <div key = {person.id}>{person.name} {person.number}</div>)}
      </div>

  )
}

const PersonForm = (props) => {
  const addPerson = (event) => {
    event.preventDefault()
    const personItem = {name: props.newName, number: props.newNumber};
    const existingPerson = props.persons.find(person => person.name === props.newName)

    if (existingPerson?.name === personItem.name && existingPerson?.number === personItem.number) {
      return (window.alert(`${existingPerson.name} is already added to contact`))
    }
    if (existingPerson?.name === personItem.name && existingPerson?.number !== personItem.number) {
      if (window.confirm(`${existingPerson.name} is already added to the phonebook,replace the old number with a new one?`)) {
        return (
            phoneBook
                .update(existingPerson.id, personItem)
                .then(updatedPerson => {
                  props.setPersons(prevPersons => prevPersons.map((person => person.id === updatedPerson.id ? updatedPerson: person)))
                  props.setNewName('')
                  props.setNewNumber('')
                }))
      }
    }
    phoneBook
        .create(personItem)
        .then(createdContact => props.setPersons(prevPersons => [...prevPersons, createdContact]))
    props.setNewName('')
    props.setNewNumber('')
  }

  return(
      <form onSubmit={addPerson} >
        <div>
          <div>name: <input value={props.newName} onChange={props.handleNameChange}/> </div>
          <div>number: <input value={props.newNumber} onChange={props.handleNumberChange} /> </div>
          <button type="submit"> add </button>
        </div>
      </form>
  )
}


const Persons = (props) => {
  return(
      props.persons.map(person=> <div key={person.id}>{person.name} {person.number} <button onClick={()=>props.handleDelete(person.id,person.name)}>delete</button></div>))
}


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [typed, setTyped] = useState('')

  useEffect(() => {
    phoneBook.getAll()
        .then(initialContact => {
          setPersons(initialContact)
        })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilter = (event) => {
    setTyped(event.target.value)
  }
  const handleDelete = (id,name) => {
    if (!window.confirm(`Delete ${name} ?`)) {
      return;
    }
    phoneBook
        .remove(id)
        .then(() => {
          setPersons(prevPersons => prevPersons.filter(person => person.id !== id))
        })
  }
  return (
      <div>
        <h2>Phonebook</h2>

        <Filter persons={persons} typed={typed} handleFilter={handleFilter}/>

        <h2> Add a new Contact </h2>
        <PersonForm persons={persons} newName={newName} newNumber={newNumber} setPersons={setPersons}
                    setNewName={setNewName} setNewNumber={setNewNumber} handleNameChange={handleNameChange}
                    handleNumberChange={handleNumberChange} handleDelete={handleDelete}/>

        <h2> All Numbers </h2>
        <Persons persons={persons} handleDelete={handleDelete}/>


      </div>
  )
}

export default App