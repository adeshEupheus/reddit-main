import React from "react";
import { useFormik } from "formik";
import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useMutation } from "urql";
import { useLoginMutation } from "../generated/graphql";
import { useRouter } from "next/router";
import { createUrqlClient } from "../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";

const Login: React.FC = () => {
  const [, login] = useLoginMutation();
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      usernameOrEmail: "",
      password: "",
    },
    validate: () => {
      type error = {
        [key: string]: any;
      };
      const errors: error = {};
      if (!formik.values.usernameOrEmail) {
        errors.username = "required";
      } else if (formik.values.usernameOrEmail.length <= 2) {
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
      const response = await login(values);
      if (response.data?.login.errors) {
        console.log(response.data.login.errors);
        // formik.errors.username = response.data.login.errors[0].message;
        if (response.data.login.errors[0].field === "password") {
          formik.errors.password = response.data.login.errors[0].message;
        } else if (response.data.login.errors[0].field === "username") {
          formik.errors.usernameOrEmail = response.data.login.errors[0].message;
        }
      } else if (response.data?.login.user) {
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
          <FormLabel htmlFor="usernameOrEmail">Username or Email</FormLabel>
          <Input
            id="usernameOrEmail"
            name="usernameOrEmail"
            type="username"
            variant="filled"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.usernameOrEmail}
          />
          {formik.touched.usernameOrEmail && formik.errors.usernameOrEmail ? (
            <h1 className="text-red-600">{formik.errors.usernameOrEmail}</h1>
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

export default withUrqlClient(createUrqlClient)(Login);
