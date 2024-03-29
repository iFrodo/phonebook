import { useState, useEffect } from 'react'
import contactsService from './services/Contacts.js'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  if (message.id === 1) {
    return (
      <div className='popup--green'>
        Contact {message.message} was updated
      </div>
    )
  } else if (message.id === 2) {
    return (<div className='popup--green'>
      Contact {message.message} was created
    </div>)
  } else if (message.id === 3) {
    return (<div className='popup--red'>
      Error, Contact {message.message} was already deleted!
    </div>)

  }



}
const Filter = ({ newFilter, onChangge }: any) => {
  return (
    <>
      filter show with: <input value={newFilter} onChange={onChangge} />
    </>
  )
}
const AddNewPerson = (props: any) => {
  return (
    <>
      <Notification message={props.message} />
      <div>name: <input value={props.newName} onChange={props.onChangeName} /></div>
      <div>number: <input value={props.newPhone} onChange={props.onChangePhone} type="tel" /></div>
    </>
  )
}
const Persons = (props: any) => {
  return (
    <>
      {props.filteredPersons.map((person: any) => <p className='person' key={person.id}>{person.name} {person.number} <button onClick={() => { props.onDeleteBtnClick(person) }}>delete</button></p>)}
    </>
  )
}
const App = () => {
  const [persons, setPersons] = useState()
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('+7')
  const [newFilter, setNewFilter] = useState('')
  const [filter, setFilter] = useState('true')
  const [message, setMessage] = useState(null)

  useEffect(() => {
    contactsService.getAll()
      .then(response => {
        setPersons(response)
      })
  }, [])
  if (!persons) {
    return null
  }
  const onSubmitForm = (e) => {
    e.preventDefault()
    const newPerson = {
      name: newName,
      number: newPhone
    }
    const isDuplicate = persons.find(person => person.name === newName)
    if (isDuplicate) {
      if (window.confirm(`${newName} is already added to phonebook,do you want to change number`)) {
        contactsService.update(isDuplicate.id, newPerson)
          .then(updatedPerson => setPersons(persons.map(person => person.id !== isDuplicate.id ? person : updatedPerson)))

        setMessage({ id: 1, message: isDuplicate.name })
        setTimeout(() => {
          setMessage(null)
        }, 3000)
      }
    } else {

      contactsService.create(newPerson)
        .then(result => {
          setPersons(persons.concat(result));
          setMessage({ id: 2, message: result.name })
          setTimeout(() => {
            setMessage(null)
          }, 3000)
        })
    }
  }
  const onChangeName = (e) => {
    setNewName(e.target.value)

  }
  const onChangePhone = (e) => {
    setNewPhone(e.target.value)

  }
  const onChangeFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewFilter(e.target.value);
    setFilter(e.target.value.trim() !== '');
  };
  const onDeleteBtnClickOf = (note) => {
    if (window.confirm(`Do you really want to delete ${note.name}?`)) {
      contactsService.remove(note.id)
        .then(remoovedPerson => setPersons(persons.filter(person => person.id != note.id)))
        
        .catch(error => {
          setMessage({ id: 3, message: note.name })
          setTimeout(() => {
            setMessage(null)
          }, 3000)
          // setNotes(notes.filter(n => n.id !== id))
        })

    }
  }
  const filteredPersons = newFilter.trim() === '' ? persons : persons.filter((person) =>
    person.name.toLowerCase().includes(newFilter.toLowerCase())
  );
  return (
    <div>
      <h2>Phonebook</h2>
      <Filter newFilter={newFilter} onChangge={onChangeFilter} />
      <form onSubmit={onSubmitForm}>
        <div>
          <h2>add a new</h2>
          <AddNewPerson newName={newName} onChangeName={onChangeName} newPhone={newPhone} onChangePhone={onChangePhone} message={message} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons} onDeleteBtnClick={onDeleteBtnClickOf} />
    </div>
  )
}

export default App
