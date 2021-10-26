import { useState } from "react";
import styled, { css } from "styled-components";
import { useTheme } from "../contexts/themeContext";
import { IColors } from "../interfaces/IColors";

import { FormikField } from "../components/FormikField";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import Button from "../components/Button";
import { useScholars } from "../contexts/scholarsContext";

import ScholarList from "../components/settings-category/ScholarList";
import CategoriesList from "../components/settings-category/CategoriesList";
import ColorPicker from "../components/ColorPicker";

const ScholarSchema = Yup.object().shape({
  name: Yup.string()
    .min(0, "1 - 12 characters only")
    .max(12, "1 - 12 characters only")
    .required("Required"),
  minQuota: Yup.number()
    .min(0, "Too low")
    .max(600, "Too high")
    .required("Required"),
});

const SettingsMinQuota = () => {
  const { colors } = useTheme();
  const [color, setColor] = useState<string>("#7189da");

  const { addCategory } = useScholars();

  const errorFieldStyle = {
    border: `1px solid ${colors.danger}`,
  };

  const inputFieldStyles = {
    border: `1px solid transparent`,
  };

  return (
    <Container colors={colors}>
      <p>New Category</p>
      <Formik
        validationSchema={ScholarSchema}
        enableReinitialize
        initialValues={{
          minQuota: 0,
          name: "",
        }}
        onSubmit={(values, { resetForm }) => {
          addCategory({ name: values.name, quota: values.minQuota, color });
          resetForm();
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <section>
              <label htmlFor="name">Name</label>
              <FormikField
                colors={colors}
                type="text"
                placeholder="Name"
                autoComplete="off"
                name="name"
                style={{
                  ...inputFieldStyles,
                  ...(errors.minQuota && touched.minQuota && errorFieldStyle),
                  padding: "5px 10px",
                }}
              />
            </section>

            <section>
              <label htmlFor="minQuota">Quota</label>
              <FormikField
                colors={colors}
                type="number"
                placeholder="Min-quota"
                autoComplete="off"
                name="minQuota"
                style={{
                  ...inputFieldStyles,
                  ...(errors.minQuota && touched.minQuota && errorFieldStyle),
                  maxWidth: 60,
                  padding: "5px 10px",
                }}
              />
            </section>
            <section>
              <label htmlFor="color" style={{ marginBottom: 7 }}>
                Color
              </label>

              <ColorPicker
                color={color}
                setActiveColor={(selectedHex: string) => setColor(selectedHex)}
              />
            </section>

            <Button
              foreground={colors.textIntense}
              type="submit"
              style={{
                border: colors.BGLight,
                background: colors.BGLighter,
              }}
            >
              Add
            </Button>
            <br />
            <span className="error">{errors.minQuota}</span>
            <span className="error">{errors.minQuota}</span>
            <span className="error">{errors.minQuota}</span>
          </Form>
        )}
      </Formik>
      <p>Categories</p>
      <CategoriesList />
      <br />
      <p>Scholars</p>
      <ScholarList />
    </Container>
  );
};

const Container = styled.div<{ colors: IColors }>`
  ${({ colors }) => css`
    color: ${colors.textNotSoIntense};
    flex: 1;
    padding: 20px;
    width: 100%;

    p {
      margin-bottom: 10px;
    }

    form {
      display: flex;
      margin-bottom: 20px;
      align-items: flex-end;

      section {
        display: flex;
        flex-direction: column;

        label {
          font-size: 10px;
        }
      }

      input {
        margin-right: 10px;
      }

      button {
        margin-left: 10px;
      }
    }

    .error {
      color: ${colors.danger};
      font-size: 12px;
    }

    @media (max-width: 439px) {
      form {
        display: grid;
        width: 100%;
        gap: 10px;

        input {
          margin-right: 0px;
          width: 210px;
        }

        button {
          margin-left: 0;
          grid-column: span 3;
        }
      }
    }
  `}
`;

export default SettingsMinQuota;
