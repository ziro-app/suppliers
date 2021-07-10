import React, { useEffect, useState } from "react"
import DayPicker from "react-day-picker"
import "react-day-picker/lib/style.css"

import IconText from "@bit/ziro.views.icon-text"
import { motion } from "framer-motion"
import { createFactory } from "@bit/ziro.utils.component-state"
import Button from "@bit/ziro.views.button"
import Icon from "@bit/ziro.views.icon2"
import { dateObjectToTimestamp, dateStringToDateObject, stringToDateMask } from "@bit/ziro.utils.string-formatter"

import { InputCalendarProps } from "../types"
import {
  timestampToDateString,
  dateRegex,
  WEEKDAYS_SHORT,
  WEEKDAYS_LONG,
  MONTHS,
  PREV_MONTH,
  NEXT_MONTH,
} from "../utils/calendar"
import {
  container,
  defaultInputStyle,
  styleTag,
  errorContainer,
  errorIcon,
  errorText,
  calendarStyle,
  buttonClearInputCalendar,
  calendarContainer,
} from "../utils/styles"
import { initialCalendar, animateCalendar, transition } from "../utils/animations"

const _InputCalendar = (globalState?: any) => {
  const InputCalendar = ({
    inputName,
    value,
    setValue,
    isLoading = false,
    inputError,
    isDisabled = false,
    styleErrorIcon,
    styleErrorText,
    style,
    dayPickerProps,
    ...props
  }: InputCalendarProps) => {
    if (globalState) {
      const { useState: gState } = globalState
      var [globalValue, setGlobalValue] = gState()
    }

    const [showCalendar, setShowCalendar] = useState<boolean>(false)
    const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined)
    const [isInvalidDate, setIsInvalidDate] = useState<boolean>(false)

    /** This useEffect is necessary, due to the delay of useState.
      On day selection via DayPicker or via typing, set the globalValue | value with a timestamp.
      Day picker sets the date as Date Object, the function dateObjectToTimestamp converts it to timestamp. */
    useEffect(() => {
      if (selectedDay) {
        if (globalState) {
          setGlobalValue({ userInput: dateObjectToTimestamp(selectedDay) })
        } else if (setValue) {
          setValue(`${dateObjectToTimestamp(selectedDay)}`)
        }
      }
    }, [selectedDay, setGlobalValue, setValue])

    /** This useEffect is necessary to allow clearForm functions */
    useEffect(() => {
      if (globalValue?.userInput === "") {
        handleClearDate()
      } else if (value === "") {
        handleClearDate()
      }
    }, [value, globalValue?.userInput])

    const handleTypingDate = (typedValue: string) => {
      const _typedValue = stringToDateMask(typedValue) // Necessary to copy/paste functionality
      setIsInvalidDate(false)
      setShowCalendar(true)

      /** Verify if value is a date string (i.e 30/04/2021) */
      if (_typedValue.length === 10) {
        /** Verify if received date is valid */
        if (dateRegex.exec(_typedValue)) {
          setSelectedDay(dateStringToDateObject(_typedValue)) // Convert dateString to DateObject and set the selected day
        } else {
          setIsInvalidDate(true)
          setSelectedDay(undefined)
        }
      } else {
        setSelectedDay(undefined)

        /** Set the value to value placed by user */
        if (globalState) {
          setGlobalValue({ userInput: _typedValue })
        } else if (setValue) {
          setValue(_typedValue)
        }
      }
    }

    const handleSelectDay = (day: Date) => {
      setSelectedDay(day)
      setIsInvalidDate(false)
      setShowCalendar(false)
    }

    const handleClearDate = () => {
      setSelectedDay(undefined)
      setIsInvalidDate(false)
      setShowCalendar(false)
      if (globalState) {
        setGlobalValue({ userInput: "" })
      } else if (setValue) {
        setValue("")
      }
    }

    return (
      <div
        style={{ ...container, position: "relative" }}
        onBlur={e => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
            setShowCalendar(false)
          }
        }}
      >
        <style>
          {styleTag}
          {calendarStyle}
        </style>

        {(selectedDay || globalValue?.userInput || value) && !isLoading && (
          <Button type="button" style={buttonClearInputCalendar} onClick={() => handleClearDate()}>
            <Icon featherName="X" width="12px" height="12px" strokeWidth="3px" />
          </Button>
        )}

        <input
          type="text"
          name={inputName}
          placeholder="Selecione ou digite a data"
          inputMode="numeric"
          value={globalState ? timestampToDateString(globalValue.userInput) : timestampToDateString(value)}
          onChange={e => handleTypingDate(e.target.value)}
          disabled={isLoading || isDisabled}
          style={{ ...defaultInputStyle, ...style }}
          maxLength={10}
          onFocus={() => setShowCalendar(true)}
          {...props}
        />

        {showCalendar && (
          <motion.div
            style={calendarContainer}
            initial={initialCalendar}
            animate={animateCalendar}
            transition={transition}
          >
            {isInvalidDate && (
              <IconText
                featherName="AlertCircle"
                styleIcon={{ ...errorIcon, ...styleErrorIcon }}
                styleText={{ ...errorText, ...styleErrorText }}
              >
                A data digitada não é válida
              </IconText>
            )}

            <DayPicker
              selectedDays={selectedDay}
              onDayClick={day => handleSelectDay(day)}
              month={selectedDay}
              months={MONTHS}
              weekdaysShort={WEEKDAYS_SHORT}
              weekdaysLong={WEEKDAYS_LONG}
              labels={{ previousMonth: PREV_MONTH, nextMonth: NEXT_MONTH }}
              {...dayPickerProps}
            />
          </motion.div>
        )}

        <div style={errorContainer}>
          {inputError && (
            <IconText
              featherName="AlertCircle"
              styleIcon={{ ...errorIcon, ...styleErrorIcon }}
              styleText={{ ...errorText, ...styleErrorText }}
            >
              {inputError}
            </IconText>
          )}
        </div>
      </div>
    )
  }

  return InputCalendar
}

const InputCalendarFactory = createFactory(_InputCalendar)
const InputCalendarConfig = { name: "InputCalendar", initialState: { userInput: "" } }
const InputCalendar = _InputCalendar()

export { InputCalendarFactory, InputCalendarConfig, InputCalendar }
