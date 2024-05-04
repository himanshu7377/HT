import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateEmployee = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [errorM, seterrorM] = useState("");
  const [ErrorM, setErrorM] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNo: "",
    gender: "",
    course: [],
    designation: "",
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log("file", file);
    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      seterrorM("Please select jpeg or png format");
    } else {
      seterrorM("");
    }
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
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    let updatedCourses = formData.course.slice();

    if (checked) {
      updatedCourses.push(value);
    } else {
      updatedCourses = updatedCourses.filter((course) => course !== value);
    }

    setFormData({ ...formData, course: updatedCourses });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      setErrorM("Full Name is required");
      return;
    }

    if (!formData.email.trim()) {
      setErrorM("Email is required");
      return;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrorM("Email is invalid");
      return;
    }

    if (!formData.mobileNo.trim()) {
      setErrorM("Mobile No is required");
      return;
    } else if (
      !/^\+?\d{8,14}$/.test(formData.mobileNo) ||
      !(formData.mobileNo.length === 10)
    ) {
      setErrorM("Mobile No is invalid");
      return;
    }

    if (!formData.gender) {
      setErrorM("Gender is required");
      return;
    }
    if (!formData.designation) {
      setErrorM("Select the Designation");
      return;
    }

    if (!selectedFile) {
      setErrorM("Upload photo required");
      return;
    }

    if (formData.course.length === 0) {
      setErrorM("At least one course must be selected");
      return;
    }

    // If all fields are valid, you can send the formData to the server here
    console.log("Form data:", formData);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("mobileNo", formData.mobileNo);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("designation", formData.designation);
      formDataToSend.append("photo", selectedFile);

      formData.course.forEach((course) => {
        formDataToSend.append("course", course);
      });

      const response = await fetch("http://localhost:5000/createemployees", {
        method: "POST",
        body: formDataToSend,
      });

      console.log("Response:", response);

      if (response.ok) {
        console.log("Form submitted successfully");
        toast.success("Employee created successfully");
        // Optionally reset form fields
        setFormData({
          fullName: "",
          email: "",
          mobileNo: "",
          gender: "",
          course: [],
          designation: "",
        });
        setSelectedFile(null);
        setImageURL("");
      } else {
        const responseData = await response.json();
        if (response.status >= 300 && response.status <= 500) {
          // Client-side error
          if (
            response.status === 300 &&
            responseData.error === "Email already exists"
          ) {
            toast.error("Email already exists");
            setErrorM("Email already exists");
          } else {
            toast.error("Failed to create employee");
            console.error("Failed to submit form");
            setErrorM("Failed to submit form");
          }
        } else {
          // Server-side error
          toast.error("Failed to create employee");
          console.error("Failed to submit form");
          setErrorM("Failed to submit form");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    setErrorM("");
  };

  return (
    <>
      <div id="main" className="bg-white">
        <h1 className="p-7 text-slate-800 text-3xl font-semibold text-center">
          Create Employee
        </h1>
        <div className="w-full h-full flex justify-center align-center">
          <div> </div>
          <form
            className="w-full max-w-xl border-2 p-4 bg-slate-500 "
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            {ErrorM && (
              <h2 className="mb-2 text-center text-lg text-red-600 font-semibold">
                {ErrorM}
              </h2>
            )}
            <div className="flex flex-wrap -mx-3 mt-4 mb-3">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-black text-xs font-bold mb-2"
                  htmlFor="grid-first-name"
                >
                  Full Name
                </label>
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  required
                  id="grid-first-name"
                  type="text"
                  placeholder="Enter Full Name"
                />
              </div>

              <div className="w-full md:w-1/2 px-3">
                <label
                  className="block uppercase tracking-wide text-black text-xs font-bold mb-2"
                  htmlFor="grid-last-name"
                >
                  Email
                </label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-last-name"
                  required
                  type="email"
                  placeholder="Enter Email"
                />
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-1">
              <div className="w-full px-3">
                <label
                  className="block uppercase tracking-wide text-black text-xs font-bold mb-2"
                  htmlFor="grid-password"
                >
                  Mobile no
                </label>
                <input
                  name="mobileNo"
                  value={formData.mobileNo}
                  onChange={handleInputChange}
                  className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-2 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-password"
                  type="tel"
                  placeholder="+91 "
                />
 
              </div>
            </div>

            <div className="flex flex-col -mx-3 mb-3">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-6">
                <label
                  className="block uppercase tracking-wide text-black text-[13px] font-bold mb-2"
                  htmlFor="grid-password"
                >
                  Gender
                </label>
                <div className="flex flex-row gap-x-[15px] aligns-center">
                  <input
                    checked={formData.gender === "male"}
                    onChange={handleInputChange}
                    type="radio"
                    className="w-[19px] h-[19px] "
                    name="gender"
                    value="male"
                  />{" "}
                  Male
                  <input
                    checked={formData.gender === "female"}
                    onChange={handleInputChange}
                    type="radio"
                    className="w-[19px] h-[19px] "
                    name="gender"
                    value="female"
                  />{" "}
                  Female
                </div>
              </div>

              <div className="w-full md:w-1/2 px-3">
                <label
                  className="block uppercase tracking-wide text-black text-[13px] font-bold mb-2"
                  htmlFor="grid-last-name"
                >
                  Course
                </label>
                <div className="flex flex-row gap-x-[10px]">
                  <label htmlFor="MCA">MCA</label>
                  <input
                    onChange={handleCheckboxChange}
                    className="w-[20px] h-[20px]"
                    type="checkbox"
                    name="course"
                    id="MCA"
                    value="MCA"
                  />
                  <label htmlFor="BCA">BCA</label>
                  <input
                    onChange={handleCheckboxChange}
                    className="w-[20px] h-[20px]"
                    type="checkbox"
                    name="course"
                    id="BCA"
                    value="BCA"
                  />
                  <label htmlFor="BSC">BSC</label>
                  <input
                    onChange={handleCheckboxChange}
                    className="w-[20px] h-[20px]"
                    type="checkbox"
                    name="course"
                    id="BSC"
                    value="BSC"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-2">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-black text-xs font-bold mb-2"
                  htmlFor="grid-state"
                >
                  Designation
                </label>
                <div className="relative">
                  <select
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    className="block appearance-none w-full bg-gray-100 border border-gray-200 text-black py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-state"
                  >
                    <option>Select Designation</option>
                    <option value="HR">HR</option>
                    <option value="Manager">Manager</option>
                    <option value="Sales">Sales</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-black text-xs font-bold mb-2"
                  htmlFor="grid-zip"
                >
                  Photo
                </label>
                <input
                  accept=".jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-zip"
                  type="file"
                  placeholder="90210"
                />
              </div>
            </div>

            <div className="flex flex-wrap justify-center -mx-3 mb-1">
              {selectedFile && (
                <div>
                  {errorM && (
                    <h2 className="text-lg text-red-600 font-semibold">
                      {errorM}
                    </h2>
                  )}
                  <img
                    src={imageURL}
                    alt="Selected"
                    className="w-[150px] rounded-lg h-[150px]"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-wrap justify-center mt-6 -mx-3 ">
              <div className="w-1/2 px-3">
                <button
                  type="submit"
                  className="mb-9 rounded-lg font-normal text-lg w-full py-2 text-white shadow shadow-lg bg-cyan-500"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateEmployee;
