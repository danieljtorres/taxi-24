export const transformDoc = function (doc) {
  doc.id = doc._id;
  delete doc._id;
  delete doc.__v;
};
