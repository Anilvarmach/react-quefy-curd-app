import React, { useState } from 'react'
import { useQuery, useMutation } from 'react-query';
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';

const AddContact = () => {

    let [addContact, setAddContact] = useState({
        "name": "",
        "mobile": "",
        "email": "",
        "photo": "",
        "groupId": ""
    });

    let handleInputChange = (e) => {
        setAddContact({
            ...addContact,
            [e.target.name]: e.target.value
        })
    }
    const navigate = useNavigate();

    let { data: groupsData } = useQuery('get-all-groups', async () => {
        return axios.get('http://localhost:4000/groups')
    })

    const { mutate } = useMutation(addContact => {
        return axios.post('http://localhost:4000/contacts', addContact)
    }, {
        onSuccess: () => {
            navigate('/contact/list', { replace: true });
        },
        onError: () => {
            navigate('/contact/add', { replace: false })
        }
    })


    let handleFormSubmit = async (e) => {
        e.preventDefault();
        mutate(addContact)
    }


    return (
        <div className='container bg-white' style={{ width: "600px" }}>
            <form onSubmit={handleFormSubmit} className="form shadow p-3 pb-5 mt-5">
                <h2 className="fw-bold mt-2">Add Contact</h2>

                <div className="form-group mt-4">
                    <label htmlFor="name">Name</label>
                    <input type="text" name='name' value={addContact.name} onChange={handleInputChange} id="name" className="form-control" />
                </div>
                <div className="form-group mt-4">
                    <label htmlFor="Phone">Phone</label>
                    <input type="number" name='mobile' value={addContact.mobile} onChange={handleInputChange} id="Phone" className="form-control" />
                </div>
                <div className="form-group mt-4">
                    <label htmlFor="Email">Email</label>
                    <input type="email" name='email' value={addContact.email} onChange={handleInputChange} id="Email" className="form-control" />
                </div>
                <div className="form-group mt-4">
                    <label htmlFor="Image">Image URL</label>
                    <input type="text" name='photo' value={addContact.photo} onChange={handleInputChange} id="Image" className="form-control" />
                </div>
                <div className="form-group mt-4">
                    <select name="groupId" id="groupId" onChange={handleInputChange} className="form-control">
                        <option>Select Group</option>
                        {
                            groupsData?.data?.map((group) => {
                                return <option key={group.id} value={group.id}>{group.name}</option>
                            })
                        }
                    </select>
                </div>

                <div className="d-felx mt-5 ms-auto">
                    <button className="btn btn-outline-primary m-2">Add</button>
                    <Link to="/contact/list" className="btn btn-outline-danger">Cancel</Link>
                </div>
            </form>
        </div>
    )
}

export default AddContact