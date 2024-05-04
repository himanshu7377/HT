import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from './Pagination';

const List = () => {
    const [emp, setemp] = useState([]);
    const [searchVal, setsearchVal] = useState("");
    const [deletedItem, setdeletedItem] = useState();
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageURL, setImageURL] = useState('');
    const [errorM, seterrorM] = useState();
    const [ErrorM, setErrorM] = useState();
    const [sortBy, setSortBy] = useState('id'); // Default sorting criterion
    const [totalUsers, setTotalUsers] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(3); // Number of users per page




    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        mobileNo: '',
        gender: '',
        course: [],
        designation: ''
    });



    const sortData = (data, sortBy) => {
        // Copy the original data array to avoid mutating the original state
        const sortedData = [...data];
    
        // Sort the data based on the sorting key
        switch (sortBy) {
            case 'id':
                sortedData.sort((a, b) => a._id.localeCompare(b._id));
                break;
            case 'name':
                sortedData.sort((a, b) => a.fullName.localeCompare(b.fullName));
                break;
            case 'email':
                sortedData.sort((a, b) => a.email.localeCompare(b.email));
                break;
            case 'date':
                sortedData.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            default:
              
                break;
        }
    
        return sortedData;
    };
    
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        console.log(file)
        if (file.type !== "image/jpeg" & file.type !== "image/png") {
            seterrorM("please select jpeg or png format")
        }
        else { seterrorM() }
        setSelectedFile(file);

        const reader = new FileReader();
        reader.onload = () => {
            setImageURL(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }


    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        let updatedCourses = formData.course.slice();

        if (checked) {
            updatedCourses.push(value);
        } else {
            updatedCourses = updatedCourses.filter(course => course !== value);
        }

        setFormData({ ...formData, course: updatedCourses });
    };



    const handleButton = () => {
        document.getElementById("updatemain").classList.add("hidden");
        document.getElementById('dataSection').classList.remove("blur-sm", "opacity-35");
        // Clear form data and image URL
        setFormData({
            fullName: '',
            email: '',
            mobileNo: '',
            gender: '',
            course: [],
            designation: ''
        });
        setImageURL('');
        setErrorM('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.fullName.trim()) {
            setErrorM('Full Name is required');
            return;
        }

        if (!formData.email.trim()) {
            setErrorM('Email is required');
            return;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setErrorM('Email is invalid');
            return;
        }

        if (!formData.mobileNo) {
            setErrorM('Mobile No is required');
            return;
        }

        if (!formData.gender) {
            setErrorM('Gender is required');
            return;
        }
        if (!formData.designation) {
            setErrorM('Select the Designation');
            return;
        }



        if (formData.course.length === 0) {
            setErrorM('At least one course must be selected');
            return;
        }

        // If all fields are valid, you can send the formData to the server here
        console.log('Form data:', formData);
        try {

            const formDataToSend = new FormData();
            formDataToSend.append('fullName', formData.fullName);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('mobileNo', formData.mobileNo);
            formDataToSend.append('gender', formData.gender);
            formDataToSend.append('designation', formData.designation);
            formDataToSend.append('photo', selectedFile);

            formData.course.forEach(course => {
                formDataToSend.append('course', course);
            });

            const response = await fetch(`http://localhost:5000/updateemployee`, {
                method: 'PUT',
                body: formDataToSend
            });

            if (response.ok) {
                console.log('Form submitted successfully');
                // document.getElementById("updatepop").classList.remove("hidden");
                // document.getElementById("updatemain").classList.add("blur-sm","hidden")
                // Optionally reset form fields
                fetchData();
                setErrorM('');
            } 
        } catch (error) {
            console.error('Error submitting form:', error);
        }
        setErrorM('');

        handleButton();

    };

    const fetchData = async () => {
        try {
            
            const url = `http://localhost:5000/employees`;

            // Fetch data from the API
            const response = await fetch(url);

            // Check if the response is successful
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            // Parse the JSON response
            const data = await response.json();

            // Set the users state with the fetched data
            setemp(data);
            setTotalUsers(data.length);
        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    };


    const handleDelete = async (itemId) => {
        try {
            const response = await fetch(`http://localhost:5000/employee/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data); // Log the response from the backend
                setdeletedItem(itemId); // Update state to trigger re-render or UI update
                setTotalUsers(data.length);
                toast.success('Item deleted successfully');
            } else {
                
                console.error('Failed to delete item');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleUpdate = async (itemId) => {
        console.log(itemId)
        const res = await fetch(`http://localhost:5000/singleemployees/${itemId}`, {
           
        });

        const data = await res.json();
        console.log(data)
        setFormData(data[0]);
        setImageURL(`http://localhost:5000/Public/EmpImage/${data[0].photo}`)
        document.getElementById("updatemain").classList.remove("hidden");
        document.getElementById('dataSection').classList.add("blur-sm","opacity-35")


    }
 
 

    useEffect(() => {
        fetchData();
    }, [searchVal, deletedItem])

     // Implement search functionality
     const filteredEmployees = emp.filter((item) =>
        item.fullName.toLowerCase().includes(searchVal.toLowerCase()) ||
        item.email.toLowerCase().includes(searchVal.toLowerCase())
    );


    const sortedEmployees = sortData(filteredEmployees, sortBy);

      // Function to handle pagination
      const indexOfLastUser = currentPage * usersPerPage;
      const indexOfFirstUser = indexOfLastUser - usersPerPage;
      const currentUsers = sortedEmployees.slice(indexOfFirstUser, indexOfLastUser);
  
      // Change page
      const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
           
            <div id="dataSection" class="w-full p-3 overflow-x-auto shadow-md sm:rounded-lg">

                <div class="flex  items-center justify-between  flex-col md:flex-row flex-wrap space-y-4 md:space-y-0 py-4 bg-white dark:bg-gray-900">
                    <label for="table-search" class="sr-only">Search</label>
                    <div class="relative">

                        <div class="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input value={searchVal} onChange={(e) => { setsearchVal(e.target.value) }} type="text" id="table-search-users" class="block py-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for users" />
                    </div>
                    <div>Total Users: {totalUsers}</div>
                    <div>
                        <label htmlFor="sort" className="mr-2">Sort By:</label>
                        <select id="sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="block px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                            <option value="id">ID</option>
                            <option value="name">Name</option>
                            <option value="email">Email</option>
                            <option value="date">Date</option>
                        </select>
                    </div>

                </div>
                <div className='overflow-x-auto'>
                <table class="w-full overflow-x-auto table">
                    <thead class="text-xs text-white uppercase bg-slate-700 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                Unique id
                            </th>

                            <th scope="col" class="px-6 py-3">
                                image
                            </th>

                            <th scope="col" class="px-6 py-3">
                                Name
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Email
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Mobile No
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Designation
                            </th>

                            <th scope="col" class="px-6 py-3">
                                Gender
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Course
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Date
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        

                        {
                            currentUsers.map((item, key) => {
                                return <tr key={key} class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">

                                    <td class="">
                                        {key + 1}
                                    </td>

                                    <td class="">
                                        <img class="w-[70px] h-[70px] rounded-lg" src={`http://localhost:5000/Public/EmpImage/${item.photo}`} alt="Jese image" />
                                    </td>


                                    <td class="">
                                        {item.fullName}
                                    </td>

                                    <td class="">
                                        {item.email}
                                    </td>

                                    <td class="">
                                        {item.mobileNo}
                                    </td>

                                    <td class="">
                                        {item.designation}
                                    </td>

                                    <td class="">
                                        {item.gender}
                                    </td>
                                    <td class="">
                                        {item.course.map((item) => { return item + "," })}
                                    </td>

                                    <td class="">
                                       {item.date}
                                    </td>


                                    <td class="">
                                        <div className='flex gap-x-4'>
                                            <button type="button" onClick={() => { handleUpdate(item._id) }} className='bg-purple-900 px-3 rounded text-white'>Edit</button>
                                            <button type="button" onClick={() => { handleDelete(item._id) }} className='bg-red-700 px-3 text-white rounded'>Del</button>
                                        </div>
                                    </td>
                                </tr>

                            })
                        }

                    </tbody>
                </table>

                    </div>
                    <Pagination
                usersPerPage={usersPerPage}
                totalUsers={emp.length}
                paginate={paginate}
                currentPage={currentPage}
            />
            </div>
           
            <div id="updatemain" className="hidden bg-white flex justify-center items-center ">

                <div className="w-[800px]  h-auto overflow-auto fixed top-[60px]  z-10 shadow   rounded-xl h-[300px] bg-slate-200 p-2 shadow shadow-xl  flex justify-center align-center">

                    <form class="w-full h-full max-w-xl" onSubmit={handleSubmit} enctype="multipart/form-data">

                        {ErrorM && <h2 className="mb-2 text-center text-lg text-red-600 font-semibold">{ErrorM}</h2>}
                        <div class="flex flex-wrap -mx-3 mb-3">

                            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                    Full Name
                                </label>
                                <input name="fullName" value={formData.fullName} onChange={handleInputChange} class="appearance-none block w-full bg-gray-100 text-gray-700 border border-red-500 rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" required id="grid-first-name" type="text" placeholder="Jane" />
                            </div>

                            <div class="w-full md:w-1/2 px-1">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-last-name">
                                    Email
                                </label>
                                <input name="email" value={formData.email} onChange={handleInputChange} class="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" required type="email" placeholder="Doe" />
                            </div>

                        </div>

                        <div class="flex flex-wrap -mx-3 mb-1">
                            <div class="w-full px-3">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
                                    Mobile no
                                </label>
                                <input value={formData.mobileNo} name="mobileNo" onChange={handleInputChange} class="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-password" required type="number" placeholder="+91 " />
            
                            </div>
                        </div>


                        <div class="flex flex-col -mx-3 mb-3">

                            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-2">
                                <label class="block uppercase tracking-wide text-gray-700 text-[13px] font-bold mb-2" for="grid-password">
                                    Gender
                                </label>
                                <div className="flex flex-row gap-x-[15px] aligns-center">
                                    <input onChange={handleInputChange} type="radio" className="w-[19px] h-[19px] " name="gender" checked={formData.gender === "male"} value="male" /> Male
                                    <input onChange={handleInputChange} type="radio" className="w-[19px] h-[19px] " name="gender" checked={formData.gender === "female"} value="female" /> Female
                                </div>
                            </div>

                            <div class="w-full md:w-1/2 px-3">
                                <label class="block uppercase tracking-wide text-gray-700 text-[13px] font-bold mb-2" for="grid-last-name">
                                    Course
                                </label>
                                <div className="flex flex-row gap-x-[10px]">
                                    <label for="MCA">MCA</label>
                                    <input onChange={handleCheckboxChange} checked={formData.course.includes("MCA")} className="w-[20px] h-[20px]" type="checkbox" name="course" id="MCA" value="MCA" />
                                    <label for="BCA">BCA</label>
                                    <input onChange={handleCheckboxChange} checked={formData.course.includes("BCA")} className="w-[20px] h-[20px]" type="checkbox" name="course" id="BCA" value="BCA" />
                                    <label for="BSC">BSC</label>
                                    <input onChange={handleCheckboxChange} checked={formData.course.includes("BSC")} className="w-[20px] h-[20px]" type="checkbox" name="course" id="BSC" value="BSC" />
                                </div>
                            </div>

                        </div>


                        <div class="flex flex-wrap -mx-3 mb-2">

                            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-state">
                                    Designation
                                </label>
                                <div class="relative">
                                    <select name="designation" value={formData.designation} onChange={handleInputChange} class="block appearance-none w-full bg-gray-100 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
                                        <option>Select Designation</option>
                                        <option value="HR">HR</option>
                                        <option value="Manager">Manager</option>
                                        <option value="Sales">Sales</option>
                                    </select>
                                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                    </div>
                                </div>
                            </div>

                            <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-zip">
                                    Photo
                                </label>

                                <input accept=".jpg,.jpeg,.png" onChange={handleFileChange} class="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-zip" type="file" placeholder="90210" />
                            </div>

                        </div>

                        <div class="flex flex-wrap justify-center -mx-3 mb-1">
                            {imageURL && (
                                <div>
                                    {errorM && <h2 className="text-lg text-red-600 font-semibold">{errorM}</h2>}
                                    <img src={imageURL} className="w-[150px] rounded-lg h-[150px]" />
                                </div>
                            )}
                        </div>



                        <div class="flex flex-wrap justify-center mt-2 -mx-3 ">
                            <div class="w-1/2 px-3">
                                <button type="submit"   className="mb-2 rounded-lg font-normal text-lg w-full py-2 text-white  shadow-lg bg-cyan-500">Update</button>
                            </div>
                        </div>

                    </form>

                </div>
            </div>



        </>
    )
}

export default List;
