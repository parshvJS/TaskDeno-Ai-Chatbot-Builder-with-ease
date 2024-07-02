import UserModel from "@/models/user/user.model";

// Create a new user
export const createUser = async (userData: any) => {
  const newUser = new UserModel({
    id: userData.id,
    email: userData.email_addresses[0].email_address,
    firstName: userData.first_name,
    lastName: userData.last_name,
    imageUrl: userData.image_url,
    clerkUserId: userData.id,
    createdAt: new Date(userData.created_at),
    updatedAt: new Date(userData.updated_at),
  });

  try {
    const savedUser = await newUser.save();
    console.log('User created:', savedUser);
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Update a user
export const updateUser = async (userData: any) => {
  const updateData = {
    email: userData.email_addresses[0].email_address,
    firstName: userData.first_name,
    lastName: userData.last_name,
    imageUrl: userData.image_url,
    updatedAt: new Date(userData.updated_at),
  };

  try {
    const updatedUser = await UserModel.findOneAndUpdate({ clerkUserId: userData.id }, updateData, { new: true });
    console.log('User updated:', updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Delete a user
export const deleteUser = async (userData: any) => {
  try {
    const deletedUser = await UserModel.findOneAndDelete({ clerkUserId: userData.id });
    console.log('User deleted:', deletedUser);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
