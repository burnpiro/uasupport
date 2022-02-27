import { faker } from '@faker-js/faker';
import { sample } from 'lodash';
// utils
import { mockImgAvatar } from '../utils/mockImages';

// ----------------------------------------------------------------------

const users = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  avatarUrl: mockImgAvatar(index + 1),
  name: faker.name.findName(),
  address: faker.address.cityName() + faker.address.streetAddress(true),
  isVerified: faker.datatype.boolean(),
  animal: faker.datatype.boolean(),
  status: sample(['available', 'closed']),
  from: faker.date.soon(2),
  to: faker.date.soon(2),
  people: faker.random.number(5)
}));

export default users;
