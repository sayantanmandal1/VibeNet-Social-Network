import React, { useState, useContext, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import ClipLoader from "react-spinners/ClipLoader";
import { AuthContext } from "../AppContext/AppContext";
import { auth, onAuthStateChanged } from "../firebase/firebase";
import Button from "./Button"; 

const Reset = () => {
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/");
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe(); // Cleanup subscription
  }, [navigate]);

  const initialValues = {
    email: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email } = formik.values;
    if (formik.isValid) {
      resetPassword(email);
      setLoading(true);
    } else {
      setLoading(false);
      alert("Check your input fields");
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <div className="flex items-center justify-center min-h-screen">
      {loading ? (
        <div className="flex justify-center items-center">
          <ClipLoader color="#ffffff" size={150} speedMultiplier={0.5} />
        </div>
      ) : (
        <Card className="w-96 bg-white/90 backdrop-filter backdrop-blur-sm shadow-xl">
          <CardHeader
            variant="gradient"
            className="mb-4 grid h-28 place-items-center bg-[#008000]"
          >
            <Typography variant="h3" color="white">
              RESET PASSWORD
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <form onSubmit={formik.handleSubmit}>
              <div className="mb-2">
                <Input
                  type="email"
                  label="Email"
                  size="lg"
                  {...formik.getFieldProps("email")}
                />
                {formik.touched.email && formik.errors.email && (
                  <Typography variant="small" color="red">
                    {formik.errors.email}
                  </Typography>
                )}
              </div>
              <Button label="Reset Password" type="submit" className="w-full h-12 flex items-center justify-center " />
            </form>
          </CardBody>
          <CardFooter className="pt-0">
            <div className="flex flex-col items-center gap-2">
              <span className="text-gray-700">Remember your password?</span>
              <Link
                to="/login"
                className="text-blue-500 hover:text-blue-700 transition-colors"
              >
                Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default Reset;
