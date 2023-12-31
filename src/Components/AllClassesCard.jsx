import { Rating } from "@smastrom/react-rating";
import React, { useContext } from "react";
import { AuthContext } from "../Providers/AuthProvider/AuthProvider";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import useCart from "../Hooks/useCart";
import useUsers from "../Hooks/useUsers";

const AllClassesCard = ({ classes }) => {
  const { darkMode, user } = useContext(AuthContext);
  const [, refetch] = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [users] = useUsers();
  const ownRole = users.find((visitor) => visitor?.email === user?.email);

  const handleAddToCart = (item) => {
    const { _id, name, image, price, instructorName } = item;
    console.log(item);
    if (user && user.email) {
      const courseItem = {
        selectedId: _id,
        name,
        image,
        price,
        instructorName,
        email: user.email,
      };
      fetch("https://fashion-institute-server.vercel.app/carts", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(courseItem),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.insertedId) {
            refetch();
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Add To Cart Successfully",
              showConfirmButton: false,
              timer: 2000,
            });
          }
        });
    } else {
      Swal.fire({
        title: "YOU HAVE TO LOGIN",
        text: "You won't be able to select this before login!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Login Now!",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login", { state: { from: location } });
        }
      });
    }
  };
  return (
    <div
      className={` card-list-container h-full relative mx-auto md:p-20  ${
        darkMode ? "bg-slate-800" : ""
      }`}
    >
      <div
        className={`text-3xl my-5 text-center underline decoration-wavy font-bold ${
          darkMode ? "text-white" : ""
        }`}
      >
        Our Classes
      </div>
      <div className="card-list">
        {classes?.map((cl, index) => (
          <div
            key={index}
            className={`card card-side mb-5 max-w-5xl mx-auto  ${
              cl.available_seats === 0
                ? "bg-red-700 border-2 border-white text-white"
                : "bg-base-300"
            } shadow-xl border-b-8 hover:border-blue-700 border-blue-500`}
          >
            <figure>
              <img
                className=" w-60 h-full object-cover"
                src={cl?.image}
                alt={cl?.name}
              />
            </figure>
            <div>
              <div className="card-body">
                <h2 className="card-title">{cl?.name}</h2>
                <li>Duration: {cl?.duration}</li>
                <li>Total Students {cl?.total_students}</li>
                <li>
                  Price:{" "}
                  <span
                    className={`border-2 ${
                      cl.available_seats === 0
                        ? "bg-white text-red-600"
                        : "border-blue-600 bg-blue-600 text-white"
                    }  rounded-full px-3 font-bold`}
                  >
                    ${cl?.price}
                  </span>
                </li>
                <li>Available Seats: {cl?.available_seats}</li>

                <Rating
                  style={{ maxWidth: 150 }}
                  value={cl.rating}
                  readOnly
                ></Rating>
                <div>
                  <span
                    className={` ${
                      cl.available_seats === 0
                        ? "bg-white text-gray-500"
                        : "bg-blue-500 text-white"
                    }   md:text-xl font-bold  pb-1  px-4  rounded-full`}
                  >
                    Instructor: {cl?.instructorName}
                  </span>
                </div>
              </div>
            </div>
            <div className="absolute left-1/2 md:left-auto md:right-0 md:top-1/2 mx-5">
              <button
                onClick={() => handleAddToCart(cl)}
                disabled={
                  cl.available_seats === 0 ||
                  ownRole?.role === "Admin" ||
                  ownRole?.role === "Instructor"
                    ? true
                    : false
                }
                className={`${
                  cl.available_seats === 0 ||
                  ownRole?.role === "Admin" ||
                  ownRole?.role === "Instructor"
                    ? "bg-white text-gray-500"
                    : "bg-blue-600 hover:bg-blue-700 hover:translate hover:scale-105 text-white"
                }  px-4 rounded-full py-1 font-semibold`}
              >
                {cl?.available_seats === 0 ? "BOOKED" : "Select"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllClassesCard;
