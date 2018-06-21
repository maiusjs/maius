module.exports = ({ router, controller }) => {
  router.get('/', controller.home.info);

  router.get('/obj', controller.obj.info);

  router.get('/number', controller.number.getNumber);
};
