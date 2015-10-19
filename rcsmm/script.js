$(document).ready(function() {
  rows = 0;
  var add_row = function() {
    $('table#groups tbody').append('<tr><td><input type="text" name="n' + rows + '"></td><td><input type="number" min="1" step="1" value="1" name="w' + rows + '"></td></tr>');
    rows += 1;
  };

  var generate_list = function() {
    var all_groups = $('input[type="number"]').map(function() {
      var row_id = $(this).attr('name').slice(-1);
      var group_arr = [];

      for (var i = 0; i < $(this).val(); i++) {
        group_arr.push($('input[name="n' + row_id + '"]').val());
      }

      return group_arr;
    });

    $('#results').html('<ol></ol>');
    while (all_groups.length > 0) {
      rand_index = Math.floor(Math.random() * all_groups.length);
      $('ol').append('<li>' + all_groups.splice(rand_index, 1) + '</li>');
    }
  };

  $('#add-group-button').click(add_row);
  add_row();

  $('#generate-button').click(generate_list);
});
