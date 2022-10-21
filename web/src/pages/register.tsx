import React from "react";
import { useFormik } from "formik";
import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useMutation } from "urql";
import { useRegisterMutation } from "../generated/graphql";
import { useRouter } from "next/router";

const Register: React.FC = () => {
  const [, register] = useRegisterMutation();
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validate: () => {
      type error = {
        [key: string]: any;
      };
      const errors: error = {};
      if (!formik.values.username) {
        errors.username = "required";
      } else if (formik.values.username.length <= 2) {
        errors.username = "username length must be greater than 2";
      }
      if (!formik.values.password) {
        errors.password = "required";
      } else if (formik.values.password.length <= 2) {
        errors.password = "password length must be greater than 2";
      }
      return errors;
    },
    onSubmit: async (values) => {
      // console.log(values)
      const response = await register(values);
      if (response.data?.register.errors) {
        console.log(response.data.register.errors);
        formik.errors.username = response.data.register.errors[0].message;
      } else if (response.data?.register.user) {
        router.push("/");
      }
    },
  });

  return (
    <div className="flex justify-center items-center w-full h-[100vh]">
      <form
        onSubmit={formik.handleSubmit}
        className="sm:w-1/4 w-[90%] p-8 bg-slate-500 rounded-md"
      >
        <FormControl className="mt-4">
          <FormLabel htmlFor="username">User Name</FormLabel>
          <Input
            id="username"
            name="username"
            type="username"
            variant="filled"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.username}
          />
          {formik.touched.username && formik.errors.username ? (
            <h1 className="text-red-600">{formik.errors.username}</h1>
          ) : (
            ""
          )}
        </FormControl>
        <FormControl className="mt-4">
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input
            id="password"
            name="password"
            type="password"
            variant="filled"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password ? (
            <h1 className="text-red-600">{formik.errors.password}</h1>
          ) : (
            ""
          )}
        </FormControl>

        <Button
          isLoading={formik.isSubmitting}
          className="mt-4"
          type="submit"
          colorScheme="purple"
          width="full"
        >
          Login
        </Button>
      </form>
    </div>
  );
};

export default Register;
