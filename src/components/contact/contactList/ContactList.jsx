import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

const ContactList = () => {
    const queryClient = useQueryClient()

    const [query, setQuery] = useState({
        text: "",
    });

    const [data, setData] = useState({
        contacts: [],
        filteredContacts: []
    })

    let { isLoading, data: contactData, isError, error } = useQuery('get-contacts', async () => {
        return await axios.get('http://localhost:4000/contacts');
    }, {
        onSuccess: () => {
            setData({
                ...data,
                contacts: contactData?.data,
                filteredContacts: contactData?.data,
            })
        }
    })


    const { mutate: deleteContact } = useMutation(contactId => {
        return axios.delete(`http://localhost:4000/contacts/${contactId}`);
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries('get-contacts')
        }
    })

    const handleDeleteContact = (contactId) => {
        deleteContact(contactId);
    }

    const handleSearch = (e) => {
        setQuery({
            ...query, text: e.target.value
        });

        let searchContact = contactData?.data.filter(contact => {
            return contact.name.toLowerCase().includes(e.target.value.toLowerCase());
        });

        setData({
            ...data,
            filteredContacts: searchContact
        })
    }

    if (isLoading) return <h3>Loading...</h3>
    if (isError) return <h3>{error.message}</h3>

    let { filteredContacts } = data
    return (
        <div className='container'>
            <div className="row mt-4">
                <div className="col-md-6"> <h2 className="fw-bold">Contact List</h2></div>
                <div className="col-md-6">
                    <form className="form d-flex flex-row">
                        <input type="text" name="search" value={query.text} onChange={handleSearch} id="" className="form-control outline-none" placeholder='Search Contact' />

                    </form>
                </div>
            </div>
            <div className="row mt-5">
                {

                    filteredContacts?.map((contact) => {
                        return (
                            <div className="col-md-4" key={contact.id}>
                                <div className="card">
                                    <div className="card-body d-flex flex-row align-items-center justify-content-between">
                                        <div>
                                            <img src={contact.photo} alt="userName" width={100} className="rounded" />
                                        </div>
                                        <div className="user-info">
                                            <p className="userName">Name: <span className='fw-bold'>{contact.name}</span> </p>
                                            <p className="userphone">Phone: <span className="fw-bold">{contact.mobile}</span> </p>
                                            <p className="useremail">Email: <span className="fw-bold">{contact.email}</span></p>
                                        </div>
                                        <div className="user-actions d-flex flex-column">
                                            <Link to={`/contact/view/${contact.id}`} className="btn btn-info btn-sm m-2"><i className="fa fa-eye text-white"></i></Link>
                                            <Link to={`/contact/edit/${contact.id}`} className="btn btn-warning btn-sm m-2"><i className="fa fa-pen text-white"></i></Link>
                                            <button className="btn btn-danger btn-sm m-2" onClick={() => handleDeleteContact(contact.id)}><i className="fa fa-trash text-white"></i></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })

                }

            </div>
        </div>
    )
}

export default ContactList