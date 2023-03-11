import Section from './shared/components/Section/Section';
import ContactForm from './modules/ContactForm/ContactForm';
import ContactList from './modules/ContactList/ContactList';
import { nanoid } from 'nanoid';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFilter, getContacts } from './shared/redux/selectors';
import { addContact, deleteContact } from './shared/redux/contactsSlice';
import { setFilter } from './shared/redux/filterSlice';

function isDublicate(name, contacts) {
  const normalizedName = name.toLowerCase();

  const dublicate = contacts.find(
    ({ name }) => normalizedName === name.toLowerCase()
  );

  return Boolean(dublicate);
}

const App = () => {
  const dispatch = useDispatch();
  const contacts = useSelector(getContacts);
  const filter = useSelector(getFilter);

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
      dispatch(addContact({ id: nanoid(), name, number }));
    },
    [contacts]
  );

  const handleDelete = useCallback(
    id => {
      dispatch(deleteContact(id));
    },
    [contacts]
  );

  const handleFilter = useCallback(
    str => {
      dispatch(setFilter(str.toLowerCase()));
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
