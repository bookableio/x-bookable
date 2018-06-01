import cdn from './cdn';

export default (roomtypeid, roomtypes) => {
  const roomtype = roomtypes && roomtypes.find(roomtype => roomtype.id === roomtypeid);
  const photo = roomtype && roomtype.photo;
  return photo && photo[0] && cdn(photo[0].thumbnail);
};
