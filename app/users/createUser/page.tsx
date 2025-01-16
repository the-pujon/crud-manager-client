'use client';
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
import { useState } from "react";
import { zfd } from "zod-form-data";

// Define Zod schema
const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "user"]),
  address: z.string().min(1, "Address is required"),
  active: z.boolean().optional(),
  languages: z.array(z.string()).optional(),
  phone: z.string().optional(),
  birthdate: z.date().optional(),
  gender: z.enum(["male", "female", "other"]),
  image: zfd.file().optional(),
});

type IUserForm = z.infer<typeof userSchema>;

const UserForm: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

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
    },
  });

  const onSubmit = async (data: IUserForm) => {
    const formData = new FormData();

    // Append form data except image
    formData.append("data", JSON.stringify({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      address: data.address,
      active: data.active,
      gender: data.gender,
      birthdate: data.birthdate ? format(data.birthdate, "yyyy-MM-dd") : undefined,
      phone: data.phone,
    }));

    // Append the image if present
    if (imageFile) {
      formData.append("file", imageFile);
    }

    try {
      // Send the data with a POST request
      const response = await fetch('http://localhost:4000/api/user', {
        method: 'POST',
        body: formData,
      });
  
      // if (!response.ok) {
      //   throw new Error('Something went wrong with the submission.');
      // }
  
      const result = await response.json();
      console.log('Server response:', result);
      // You can handle the server's response here
      // For example, show a success message or redirect the user
    } catch (error) {
      console.error('Error during form submission:', error);
      // Handle error, e.g., show error message to the user
    }

    // Log or submit the formData to your backend or API
    console.log(formData);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Ensure we're handling the first file
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setImageFile(file); // Set the file to state
      setImagePreview(objectUrl); // Set the preview image URL
    }
  };

  const removeImage = () => {
    setImageFile(null); // Remove file from state
    setImagePreview(null); // Remove preview
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 container mx-auto max-w-sm">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Name
        </label>
        <Input {...register("name")} id="name" />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <Input {...register("email")} id="email" type="email" />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <Input {...register("password")} id="password" type="password" />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
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
        {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
      </div>

      {/* Address */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium">
          Address
        </label>
        <Textarea {...register("address")} id="address" />
        {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
      </div>

      {/* Active */}
      <div className="flex items-center space-x-2">
        <Checkbox {...register("active")} id="active" defaultChecked={true} />
        <label htmlFor="active">Active</label>
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-medium">Gender</label>
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
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
                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        />
        {errors.birthdate && <p className="text-red-500 text-sm">{errors.birthdate.message}</p>}
      </div>

      {/* Image Upload */}
      <div>
        <label>Profile picture</label>
        <div>
          <Input
            className="bg-neutral-900"
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleImageChange}
          />
        </div>
        {imagePreview && (
          <div className="mt-2">
            <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover" />
            <button
              type="button"
              onClick={removeImage}
              className="text-red-500 mt-1"
            >
              Remove Image
            </button>
          </div>
        )}
        {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
      </div>

      {/* Submit Button */}
      <div className="flex justify-center mt-6">
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
};

export default UserForm;
