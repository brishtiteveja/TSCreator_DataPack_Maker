window.define(["baseView"], function (BaseView) {

    var NodeView = BaseView.extend({
        el: "#node-editor",
        events: {
            'click a.close-reveal-modal': 'closeModal',
            'click a.delete-node': 'deleteNode',
            'change input': 'updateNode',
            'change select': 'updateNode'
        },
        template: new window.EJS({
            url: "/evtree_maker/ejs/node_editor.ejs"
        }),
        initialize: function (node) {
            this.node = node;
            this.render();
        },
        render: function () {
            this.$el.html(this.template.render(this.node.toJSON()));
            this.$el.foundation('reveal', 'open');
            this.$("select.branch-style").val(this.node.get('style'));
            this.$("select.range-type").val(this.node.get('rangeType'));
        },
        closeModal: function () {
            this.$el.foundation('reveal', 'close');
        },
        deleteNode: function () {},
        updateNode: function () {
            this.node.set({
                name: this.$("input.name").val(),
                description: this.$("textarea.description").val(),
                color: this.$("input.branch-color").val(),
                style: this.$("select.branch-style").val(),
                rangeType: this.$("select.range-type").val()
            });
            this.node.update();
        }
    });

    return NodeView;
});