import Section from './shared/components/Section/Section';
import ContactForm from './modules/ContactForm/ContactForm';
import ContactList from './modules/ContactList/ContactList';
import { nanoid } from 'nanoid';

import { useState, useCallback, useMemo } from 'react';

function useLocalStorage(key, value) {
  const storageData = localStorage.getItem(key);
  const defaultValue = storageData ? JSON.parse(storageData) : value;
  const [state, setState] = useState(defaultValue);

  const writeData = val => {
    const data = typeof val === 'function' ? val() : val;
    localStorage.setItem(key, JSON.stringify(data));
    setState(val);
  };

  return [state, writeData];
}

function isDublicate(name, contacts) {
  const normalizedName = name.toLowerCase();

  const dublicate = contacts.find(
    ({ name }) => normalizedName === name.toLowerCase()
  );

  return Boolean(dublicate);
}

const App = () => {
  const [contacts, setContacts] = useLocalStorage('contacts', []);
  const [filter, setFilter] = useState('');

  const getFilteredContacts = useCallback(() => {
    if (!filter.length) {
      return contacts;
    } else {
      return contacts.filter(({ name }) => name.toLowerCase().includes(filter));
    }
  }, [contacts, filter]);

  const handleSubmit = useCallback(
    (name, number) => {
      if (isDublicate(name, contacts)) {
        alert('This contact already exist');
        return;
      }

      const newContact = {
        id: nanoid(),
        name: name,
        number: number,
      };

      setContacts(() => [...contacts, newContact]);
    },
    [contacts]
  );

  const handleDelete = useCallback(
    id => {
      const filteredContacts = contacts.filter(
        ({ id: idFromArray }) => idFromArray !== id
      );
      setContacts(filteredContacts);
    },
    [contacts]
  );

  const handleFilter = useCallback(
    str => {
      setFilter(str.toLowerCase());
    },
    [filter]
  );

  const filteredContacts = useMemo(
    () => getFilteredContacts(),
    [filter, contacts]
  );

  return (
    <div className="container">
      <Section title="Phonebook">
        <ContactForm onSubmit={handleSubmit} />
      </Section>
      <Section title="Contacts">
        <ContactList
          onFilter={handleFilter}
          onDelete={handleDelete}
          contacts={filteredContacts}
        />
      </Section>
    </div>
  );
};

export default App;
