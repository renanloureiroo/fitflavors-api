import { UserResponseDTO } from './user-response.dto';

export type FetchProfileDTO = {
  id: string;
};

export type FetchProfileResponseDTO = {
  profile: UserResponseDTO;
};
