export const up = async ({ sequelize, Sequelize }) => {
	await sequelize.queryInterface.addColumn('Releases', 'historyKeyValidation', {
		type: Sequelize.TEXT,
	});
};

export const down = async ({ sequelize }) => {
	await sequelize.queryInterface.removeColumn('Releases', 'historyKeyValidation');
};
