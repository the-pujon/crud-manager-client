"use client";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
// import { zfd } from "zod-form-data";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { userSchema } from "@/schema/userSchema";
// import { useRouter } from "next/router";


export type IUserForm = z.infer<typeof userSchema>;

const UserForm: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter()
  const imageInputRef = useRef<HTMLInputElement | null>(null); // Ref for the file input

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm<IUserForm>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
      address: "",
      active: true,
      gender: "other",
      phone: "",
      languages: [], // default empty array
    },
  });

  const onSubmit = async (data: IUserForm) => {
    console.log(data);
    setLoading(true);
    const formData = new FormData();

    // Append form data except image
    formData.append(
      "data",
      JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        address: data.address,
        active: data.active,
        gender: data.gender,
        birthdate: data.birthdate
          ? format(data.birthdate, "yyyy-MM-dd")
          : undefined,
        phone: data.phone,
        languages: data.languages, // append languages
      })
    );

    // Append the image if present
    if (imageFile) {
      formData.append("file", imageFile);
    }

    try {
      // Send the data with a POST request
      const response = await fetch("http://localhost:4000/api/user", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log("Server response:", result);
      router.push('/users')
    } catch (error) {
      console.error("Error during form submission:", error);
    }
    finally {
      setLoading(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Ensure we're handling the first file
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setImageFile(file); // Set the file to state
      setImagePreview(objectUrl); // Set the preview image URL
    }
  };

  // const removeImage = () => {
  //   setImageFile(null); // Remove file from state
  //   setImagePreview(null); // Remove preview
  // };

  const removeImage = () => {
    setImageFile(null); // Remove file from state
    setImagePreview(null); // Remove preview
    if (imageInputRef.current) {
      imageInputRef.current.value = ""; // Reset the file input
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 container mx-auto max-w-sm"
    >
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Name
        </label>
        <Input {...register("name")} id="name" />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <Input {...register("email")} id="email" type="email" />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium">
          Phone
        </label>
        <Input {...register("phone")} id="phone" type="tel" />
        {errors.phone && (
          <p className="text-red-500 text-sm">{errors.phone.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <Input {...register("password")} id="password" type="password" />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      {/* Role */}
      <div>
        <label className="block text-sm font-medium">Role</label>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.role && (
          <p className="text-red-500 text-sm">{errors.role.message}</p>
        )}
      </div>

      {/* Address */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium">
          Address
        </label>
        <Textarea {...register("address")} id="address" />
        {errors.address && (
          <p className="text-red-500 text-sm">{errors.address.message}</p>
        )}
      </div>

      {/* Active (Radio Button) */}
      <div>
        <label className="block text-sm font-medium">Active</label>
        <Controller
          name="active"
          control={control}
          render={({ field }) => (
            <RadioGroup
              value={field.value ? "true" : "false"}
              onValueChange={(value) => field.onChange(value === "true")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="active-yes" />
                <span>Yes</span>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="active-no" />
                <span>No</span>
              </div>
            </RadioGroup>
          )}
        />
        {errors.active && (
          <p className="text-red-500 text-sm">{errors.active.message}</p>
        )}
      </div>

      {/* Languages (Checkbox) */}
      <div>
        <label className="block text-sm font-medium">Languages</label>
        <div className="space-y-2">
          <Controller
            name="languages"
            control={control}
            defaultValue={[]} // Ensure the field has a default value of an empty array
            render={({ field }) => (
              <div className="space-y-2">
                {["English", "Spanish", "French", "German", "Chinese"].map(
                  (language) => (
                    <div key={language} className="flex items-center space-x-2">
                      <Checkbox
                        id={language}
                        value={language}
                        checked={field.value?.includes(language) || false} // Safely check if language is selected
                        onCheckedChange={(checked: boolean) => {
                          // Ensure that field.value is never undefined
                          const currentLanguages = field.value ?? [];

                          if (checked) {
                            // Add language to the array if checked
                            field.onChange([...currentLanguages, language]);
                          } else {
                            // Remove language from the array if unchecked
                            field.onChange(
                              currentLanguages.filter(
                                (lang: string) => lang !== language
                              )
                            );
                          }
                        }}
                      />
                      <label htmlFor={language}>{language}</label>
                    </div>
                  )
                )}
              </div>
            )}
          />
        </div>
      </div>

      {/* Birthdate */}
      <div>
        <label htmlFor="birthdate" className="block text-sm font-medium">
          Birthdate
        </label>
        <Controller
          name="birthdate"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col">
              <div>Date of birth</div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        />
        {errors.birthdate && (
          <p className="text-red-500 text-sm">{errors.birthdate.message}</p>
        )}
      </div>

      {/* Image Upload */}
      <div>
        <label>Profile picture</label>
        <div>
          <Input
           ref={imageInputRef}
            className=""
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleImageChange}
           
          />
        </div>
        {imagePreview && (
          <div className="mt-2">
            <Image
              src={imagePreview}
              alt="Preview"
              className="w-32 h-32 object-cover"
              width={200}
              height={200}
            />
            <button
              type="button"
              onClick={removeImage}
              className="text-red-500 mt-1"
            >
              Remove Image
            </button>
          </div>
        )}
        {errors.image && (
          <p className="text-red-500 text-sm">{errors.image.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-center mt-6">
        <Button type="submit" disabled={loading}>
          {
            loading ? <span>Loading...</span> : <span>Submit</span>
          }
          </Button>
      </div>
    </form>
  );
};

export default UserForm;
