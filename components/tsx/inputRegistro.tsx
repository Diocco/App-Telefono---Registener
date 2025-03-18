import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Field, Input } from "@chakra-ui/react";
import "../css/inputRegistro.css";
import { useForm } from "react-hook-form";
import { InputGroup } from "../ui/input-group";

export const InputRegistroIcono = ({
  fontAwesome,
  useFormParams,
  placeholder,
  onClick,
  onClickParams,
  textoError,
  type = "text",
  titulo,
  defaultValue,
  claseAdicional,
  onChange,
}: {
  fontAwesome?: IconDefinition;
  useFormParams?: any;
  placeholder?: string;
  onClick?: Function;
  onClickParams?: string;
  textoError?: string;
  type?: string;
  titulo?: string;
  defaultValue?: string | number;
  claseAdicional?: string;
  onChange?: Function;
}) => {
  return (
    <>
      <Field.Root invalid={textoError ? true : false}>
        <Field.Label>{titulo}</Field.Label>
        <InputGroup
          flex="1"
          margin="0 9px"
          startElement={
            fontAwesome && (
              <FontAwesomeIcon className="iconoInput" icon={fontAwesome} />
            )
          }
        >
          <Input
            {...useFormParams}
            className={`${claseAdicional} inputGeneral`}
            placeholder={placeholder}
            onClick={() => {
              {
                onClick && onClick(onClickParams);
              }
            }}
            onChange={(event) => {
              {
                onChange && onChange(event.target.value);
              }
            }}
            type={type}
            defaultValue={defaultValue ?? ""}
          />
        </InputGroup>
        <Field.ErrorText marginLeft="12px" fontSize="15px">
          {textoError}
        </Field.ErrorText>
      </Field.Root>
    </>
  );
};

export const InputRegistro = ({
  useFormParams,
  placeholder,
  onClick,
  onClickParams,
  textoError,
  type = "text",
  titulo,
  defaultValue,
  claseAdicional,
  onChange,
}: {
  useFormParams?: any;
  placeholder?: string;
  onClick?: Function;
  onClickParams?: string;
  textoError?: string;
  type?: string;
  titulo?: string;
  defaultValue?: string | number;
  claseAdicional?: string;
  onChange?: Function;
}) => {
  return (
    <>
      <Field.Root invalid={textoError ? true : false}>
        <Field.Label>{titulo}</Field.Label>
        <Input
          {...useFormParams}
          className={`${claseAdicional} inputGeneral`}
          placeholder={placeholder}
          onClick={() => {
            {
              onClick && onClick(onClickParams);
            }
          }}
          onChange={(event) => {
            {
              onChange && onChange(event.target.value);
            }
          }}
          type={type}
          defaultValue={defaultValue ?? ""}
        />
        <Field.ErrorText marginLeft="12px" fontSize="15px">
          {textoError}
        </Field.ErrorText>
      </Field.Root>
    </>
  );
};
