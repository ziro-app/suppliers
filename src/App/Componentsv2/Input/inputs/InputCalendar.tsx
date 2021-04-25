import React, { useEffect, useRef, useState } from "react"
import { createFactory } from "../../componentState"
import DayPickerInput from "react-day-picker/DayPickerInput"
import { DayModifiers } from "react-day-picker/types/Modifiers"
import { DateUtils } from "react-day-picker"

import "react-day-picker/lib/style.css"

import dateFnsFormat from "date-fns/format"
import dateFnsParse from "date-fns/parse"

import { popUpStyle, clearBtn } from "../utils/stylesInputCalendar"

interface InputCalendarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Aqui pode-se passar estilos customizados */
  style?: React.CSSProperties
  value?: any
  setValue?: any
}

const _inputCalendar = (globalState?: any) => {
  const InputCalendar = ({ value, setValue, style, ...props }: InputCalendarProps) => {
    if (globalState) {
      const { useState: gState } = globalState
      var [globalValue, setGlobalValue] = gState()
    }

    const dayPickerInputRef = useRef(null)
    const [inputValue, setInputValue] = useState(
      dayPickerInputRef.current !== null ? dayPickerInputRef.current.input.value : "",
    )

    const WEEKDAYS_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
    const WEEKDAYS_LONG = [
      "Domingo",
      "Segunda-Feira",
      "Terça-Feira",
      "Quarta-Feira",
      "Quinta-Feira",
      "Sexta-Feira",
      "Sábado",
    ]
    const MONTHS = [
      "Janeiro / ",
      "Fevereiro / ",
      "Março / ",
      "Abril / ",
      "Maio / ",
      "Junho / ",
      "Julho / ",
      "Agosto / ",
      "Setembro / ",
      "Outubro / ",
      "Novembro / ",
      "Dezembro / ",
    ]
    const PREV_MONTH = "Mês anterior"
    const NEXT_MONTH = "Próximo mês"
    const FORMAT = "dd/MM/yyyy"

    const handleDayClick = (day: Date, { selected, disabled }: DayModifiers, dayPickerInput: any) => {
      const dayPickerInputValue = dayPickerInput.input.value

      if (disabled) return
      if (selected) return globalState ? setGlobalValue({ userInput: undefined }) : setValue(undefined)
      if (globalState) {
        setGlobalValue({ userInput: dayPickerInputValue })
        setInputValue(dayPickerInputValue)
      } else {
        setValue(dayPickerInputValue)
        setInputValue(dayPickerInputValue)
      }
    }

    const handleClear = () => {
      if (globalState) {
        setGlobalValue({ userInput: undefined })
        setInputValue((dayPickerInputRef.current.input.value = ""))
      } else {
        setValue((dayPickerInputRef.current.input.value = ""))
        setInputValue((dayPickerInputRef.current.input.value = ""))
      }
    }

    const parseDate = (str: string, format: string, locale: any) => {
      const parsed = dateFnsParse(str, format, new Date(), { locale })
      if (DateUtils.isDate(parsed)) {
        return parsed
      }
      return undefined
    }

    const formatDate = (date: number | Date, format: string, locale: any) => {
      return dateFnsFormat(date, format, { locale })
    }

    return (
      <div {...props} style={{ ...style }}>
        <style>{popUpStyle}</style>
        <div style={{ position: "relative" }}>
          {globalState &&
            globalValue.userInput !== undefined &&
            globalValue.userInput !== "" &&
            inputValue !== undefined &&
            inputValue !== "" && (
              <button style={clearBtn as React.CSSProperties} type="button" onClick={handleClear}>
                X
              </button>
            )}
          {!globalState && value !== undefined && value !== "" && inputValue !== undefined && inputValue !== "" && (
            <button style={clearBtn as React.CSSProperties} type="button" onClick={handleClear}>
              X
            </button>
          )}
        </div>
        {/* @ts-ignore*/}
        <DayPickerInput
          {...props}
          ref={dayPickerInputRef}
          value={
            globalState
              ? globalValue === undefined
                ? ""
                : dayPickerInputRef.current !== null && dayPickerInputRef.current.input.value
              : value === undefined
              ? ""
              : dayPickerInputRef.current !== null && dayPickerInputRef.current.input.value
          }
          onDayChange={handleDayClick}
          placeholder="Selecione ou digite a data"
          format={FORMAT}
          formatDate={formatDate}
          parseDate={parseDate}
          dayPickerProps={{
            months: MONTHS,
            weekdaysShort: WEEKDAYS_SHORT,
            weekdaysLong: WEEKDAYS_LONG,
            labels: {
              previousMonth: PREV_MONTH,
              nextMonth: NEXT_MONTH,
            },
          }}
        />
      </div>
    )
  }

  return InputCalendar
}

const InputCalendarFactory = createFactory(_inputCalendar)
const InputCalendarConfig = { name: "InputCalendar", initialState: { userInput: undefined } }
const InputCalendar = _inputCalendar()

export { InputCalendarFactory, InputCalendarConfig, InputCalendar }
