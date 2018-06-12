module.exports = ({ router, controller }) => {
  router.get('/', controller.home.info);

  router.get('/number', controller.number.info);
};
