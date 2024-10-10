"use client"
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { FormInputs } from './types/Formtype';
import { FaArrowLeft } from "react-icons/fa6";
import { Toaster, toast } from 'react-hot-toast';
import CustomInput from './compoents/InputCustom';
import { IoCaretDownSharp } from "react-icons/io5";
import { useForm, Controller } from "react-hook-form";
import { ChangeEvent, useEffect, useRef, useState } from "react";

const axisData = ["01", "02", "03", "04", "05", "06", "07", "08", "09"]

export default function Home() {
  const dateTimeRef = useRef<HTMLInputElement | null>(null);
  const flatpickrInstance = useRef<flatpickr.Instance | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const { control, handleSubmit, formState: { errors }, setValue } = useForm<FormInputs>({
    defaultValues: {
      datetime: '',
      quantity: '',
      axis: '',
      revenue: '',
      price: ''
    }
  });

  useEffect(() => {
    if (dateTimeRef.current) {
      flatpickrInstance.current = flatpickr(dateTimeRef.current, {
        enableTime: true,
        time_24hr: true,
        dateFormat: 'd/m/Y H:i:S',
        enableSeconds: true,
        onChange: (selectedDates) => {
          setValue('datetime', selectedDates[0].toLocaleString());
        }
      });
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setValue]);

  const onSubmit = (data: FormInputs) => {
    console.log(data);
    toast.success('Cập nhật giao dịch thành công!');
  };

  const handleAxisClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex justify-center pt-5">
      <Toaster position="top-right" />
      <form onSubmit={handleSubmit(onSubmit)} className="w-11/12 sm:w-10/12 md:w-2/3 lg:w-1/2 pb-10">
        <div className="flex items-center justify-between h-fit w-full shadow-b px-6 pb-5">
          <div>
            <button type="button" className="flex items-center gap-2"><FaArrowLeft /> Đóng</button>
            <h1 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl pt-4">Nhập giao dịch</h1>
          </div>
          <button type="submit" className="bg-blue-500 text-white rounded-xl px-5 py-2">Cập nhật</button>
        </div>
        <section className="px-4 pt-7 flex flex-col gap-4">
          <Controller
            name="datetime"
            control={control}
            rules={{ required: "Vui lòng chọn thời gian" }}
            render={({ field }) => (
              <div>
                <CustomInput
                  label="Thời gian"
                  type="text"
                  id="time-input"
                  refProp={dateTimeRef}
                  datepicker
                  onClickCalendar={() => flatpickrInstance.current?.open()}
                  {...field}
                />
                {errors.datetime && (
                  <p className="text-red-500 text-sm mt-1">{errors.datetime.message}</p>
                )}
              </div>
            )}
          />
          <Controller
            name="quantity"
            control={control}
            rules={{
              required: "Vui lòng nhập số lượng",
              validate: {
                notEmpty: (value) => value.toString().trim() !== '' || "Vui lòng nhập số lượng",
                isPositive: (value) => parseFloat(value.toString()) > 0 || "Số lượng phải lớn hơn 0"
              }
            }}
            render={({ field }) => (
              <div>
                <CustomInput
                  label="Số lượng"
                  type="number"
                  id="quantity"
                  {...field}
                  value={field.value === 0 ? '' : field.value}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value;
                    field.onChange(value === '' ? '' : Number(value));
                  }}
                />
                {errors.quantity && (
                  <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>
                )}
              </div>
            )}
          />
          <Controller
            name="axis"
            control={control}
            rules={{ required: "Vui lòng chọn trụ" }}
            render={({ field: { onChange, value } }) => (
              <div>
                <div ref={dropdownRef} className="relative">
                  <div
                    onClick={handleAxisClick}
                    className="flex h-14 p-2 w-full items-center border border-gray-300 rounded-xl cursor-pointer"
                  >
                    <div className="flex-1 flex flex-col">
                      <label className="text-gray-500 text-xs">Trụ</label>
                      <p className={`${value ? "flex" : "invisible"} text-sm pt-1`}>
                        {value || "00"}
                      </p>
                    </div>
                    <span className="text-gray-600 pr-2">
                      <IoCaretDownSharp />
                    </span>
                  </div>
                  {isOpen && (
                    <ul className="absolute top-full left-0 border w-full bg-white rounded-xl mt-1 z-10">
                      {axisData.map((item) => (
                        <li
                          key={item}
                          onClick={() => {
                            onChange(item);
                            setIsOpen(false);
                          }}
                          className="hover:bg-gray-200 text-center p-2 cursor-pointer first:rounded-t-xl last:rounded-b-xl border-b last:border-none"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {errors.axis && (
                  <p className="text-red-500 text-sm mt-1">{errors.axis.message}</p>
                )}
              </div>
            )}
          />
          <Controller
            name="revenue"
            control={control}
            rules={{
              required: "Vui lòng nhập doanh thu",
              validate: {
                notEmpty: (value) => value.toString().trim() !== '' || "Vui lòng nhập doanh thu",
                isPositive: (value) => parseFloat(value.toString()) > 0 || "Doanh thu phải lớn hơn 0"
              }
            }}
            render={({ field }) => (
              <div>
                <CustomInput
                  label="Doanh thu"
                  type="number"
                  id="revenue"
                  {...field}
                  value={field.value === 0 ? '' : field.value}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value;
                    field.onChange(value === '' ? '' : Number(value));
                  }}
                />
                {errors.revenue && (
                  <p className="text-red-500 text-sm mt-1">{errors.revenue.message}</p>
                )}
              </div>
            )}
          />
          <Controller
            name="price"
            control={control}
            rules={{
              required: "Vui lòng nhập đơn giá",
              validate: {
                notEmpty: (value) => value.toString().trim() !== '' || "Vui lòng nhập đơn giá",
                isPositive: (value) => parseFloat(value.toString()) > 0 || "Đơn giá phải lớn hơn 0"
              }
            }}
            render={({ field }) => (
              <div>
                <CustomInput
                  label="Đơn giá"
                  type="number"
                  id="price"
                  {...field}
                  value={field.value === 0 ? '' : field.value}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value;
                    field.onChange(value === '' ? '' : Number(value));
                  }}
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                )}
              </div>
            )}
          />
        </section>
      </form>
    </div>
  );
}