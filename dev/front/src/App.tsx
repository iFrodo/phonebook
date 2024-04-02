import { useState, useEffect } from 'react'
import contactsService from './services/Contacts.js'
interface IPerson {
  id: String,
  name: String,
  number: Number
}
interface IMessage {
  id: number;
  message: String;
}
const Notification = ({ message }: any) => {
  console.log(message);

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
    return (<div className='popup--green'>
      Contact {message.message} was  deleted!
    </div>)

  } else if (message.id === 4) {
    return (<div className='popup--green'>
      Contact {message.message} was  deleted!
    </div>)
  } else if (message.id === 5) {
    return (<div className='popup--red'>
      Contact {message.message.error}
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
      <button type="submit">add</button>
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
  const [persons, setPersons] = useState<IPerson[]>([]);
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('+7')
  const [newFilter, setNewFilter] = useState('')
  const [filter, setFilter] = useState('true')
  const [message, setMessage] = useState<IMessage | null>(null);
  console.log(filter);


  useEffect(() => {
    contactsService.getAll()
      .then(response => {
        setPersons(response)
      })
  }, [])
  if (!persons) {
    return null
  }
  const onSubmitForm = (e: any) => {
    e.preventDefault()
    const newPerson = {
      name: newName,
      number: newPhone
    }
    const isDuplicate = persons.find(person => person.name === newName)
    if (isDuplicate) {
      if (window.confirm(`${newName} is already added to phonebook,do you want to change number`)) {
        contactsService.update(isDuplicate.id, newPerson)
          .then((updatedPerson) => {
            setPersons(persons.map(person => person.id !== isDuplicate.id ? person : updatedPerson))
            setMessage({ id: 1, message: isDuplicate.name })
            setTimeout(() => {
              setMessage(null)
            }, 3000)
          })
          .catch((error) => {
            setMessage({ id: 5, message: error.response.data })
            setTimeout(() => {
              setMessage(null)
            }, 3000)
          })

      }
    } else {

      contactsService.create(newPerson)
        .then(result => {
          setPersons(persons.concat(result.data));
          setMessage({ id: 2, message: result.data.name })
          setTimeout(() => {
            setMessage(null)
          }, 3000)
        })
        .catch((error) => {
          console.log(error.response.data);
          setMessage({ id: 5, message: error.response.data })
          setTimeout(() => {
            setMessage(null)
          }, 3000)

        })

    }
  }
  const onChangeName = (e: any) => {
    setNewName(e.target.value)

  }
  const onChangePhone = (e: any) => {
    setNewPhone(e.target.value)

  }
  const onChangeFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewFilter(e.target.value);
    setFilter(String(e.target.value.trim() !== ''));
  };

  const onDeleteBtnClickOf = (note: any) => {
    console.log(`${note.id}`)
    if (window.confirm(`Do you really want to delete ${note.name}?`)) {
      contactsService.remove(note.id)

        .then(remoovedPerson => {
          console.log(remoovedPerson);

          setPersons(persons.filter(person => person.id != note.id));
          setMessage({ id: 3, message: note.name });
          setTimeout(() => {
            setMessage(null);
          }, 3000);
        })
        .catch(error => {
          console.log(error);

          setMessage({ id: 4, message: note.name });
          setTimeout(() => {
            setMessage(null);
          }, 3000);
          // setNotes(notes.filter(n => n.id !== id));
        });
    }
  };

  const filteredPersons = newFilter.trim() === '' ? persons : persons.filter((person) =>
    person.name.toLowerCase().includes(newFilter.toLowerCase())
  );
  return (
    <div className='phonebook'>
      <div className='actions'>
        <div className='filter'>
          <h2>Phonebook</h2>
          <Filter newFilter={newFilter} onChangge={onChangeFilter} />
        </div>

        <form onSubmit={onSubmitForm}>
          <div className='addnew'>
            <h2>add a new</h2>
            <AddNewPerson newName={newName} onChangeName={onChangeName} newPhone={newPhone} onChangePhone={onChangePhone} message={message} />

          </div>
        </form>
      </div>
      <div className='numbers'>
        <h2>Numbers</h2>
        <Persons filteredPersons={filteredPersons} onDeleteBtnClick={onDeleteBtnClickOf} />
      </div>
    </div>
  )
}

export default App
