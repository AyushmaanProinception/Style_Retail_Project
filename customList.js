$(document).ready(function () {
    function formatCustomerListView() {
        var $listAnchors = $('span[name="MyCustomer_List_Style_dlb"]');
        if ($listAnchors.length === 0) return;

        $listAnchors.each(function () {
            var $listAnchor = $(this);
            var $viewContainer = $listAnchor.closest('.view, .grid');
            if ($viewContainer.length === 0) return;

            var $addBtn = $viewContainer.find('a[name*="Add a customer"]');
            if ($addBtn.length) {
                var $toolbar = $addBtn.closest('.grid-toolbars');
                if ($toolbar.length && $addBtn.parent()[0] !== $toolbar[0]) {
                    $toolbar.append($addBtn);
                }
            }

            var $filterButtons = $viewContainer.find('a[name="Button All"], a[name="Button In Progress"], a[name="Button Need attention"], a[name="Button Completed"]');
            if ($filterButtons.length && !$filterButtons.filter('.active').length) {
                $viewContainer.find('a[name="Button All"]').addClass('active selected');
            }

            var unitColIndex = -1;
            var daysColIndex = -1;

            $viewContainer.find('.grid-header-table th, .grid thead th, .grid-column-header-table td, .grid thead td').each(function (idx) {
                var title = $(this).text().trim().toUpperCase();
                if (title.indexOf('UNIT NUMBER') !== -1) {
                    unitColIndex = idx;
                } else if (title.indexOf('DAYS REMAINING') !== -1 || title.indexOf('DAYS LEFT') !== -1) {
                    daysColIndex = idx;
                }
            });

            if (unitColIndex !== -1 || daysColIndex !== -1) {
                $viewContainer.find('.grid-content-table tbody tr:not(.empty-grid)').each(function () {
                    var $cells = $(this).children('td');

                    if (unitColIndex !== -1 && $cells.length > unitColIndex) {
                        var $unitCell = $cells.eq(unitColIndex);
                        if (!$unitCell.data('formatted')) {
                            var $innerWrapper = $unitCell.find('.grid-content-cell-wrapper');
                            var unitText = $innerWrapper.length ? $innerWrapper.text().trim() : $unitCell.text().trim();
                            
                            if (unitText !== '' && unitText !== '-' && unitText !== '—') {
                                var targetWrapper = $innerWrapper.length ? $innerWrapper : $unitCell;
                                targetWrapper.html('<span class="unit-pill">' + unitText + '</span>');
                            }
                            $unitCell.data('formatted', true);
                        }
                    }

                    if (daysColIndex !== -1 && $cells.length > daysColIndex) {
                        var $daysCell = $cells.eq(daysColIndex);
                        if (!$daysCell.data('formatted')) {
                            var $daysWrapper = $daysCell.find('.grid-content-cell-wrapper');
                            var rawText = $daysWrapper.length ? $daysWrapper.text().trim() : $daysCell.text().trim();
                            var lower = rawText.toLowerCase();
                            var numVal = parseInt(rawText, 10);
                            var targetDaysWrapper = $daysWrapper.length ? $daysWrapper : $daysCell;

                            if (lower === 'completed') {
                                targetDaysWrapper.html('<span class="days-pill-completed">Completed</span>');
                            } else if (lower.indexOf('no longer') !== -1) {
                                targetDaysWrapper.html('<span class="days-muted">' + rawText + '</span>');
                            } else if (!isNaN(numVal) && numVal <= 89) {
                                targetDaysWrapper.html('<span class="days-urgent">' + rawText + '</span>');
                            }
                            $daysCell.data('formatted', true);
                        }
                    }
                });
            }
        });
    }

    formatCustomerListView();

    $(document).ajaxComplete(function () {
        formatCustomerListView();
    });

    $(document).on('click', '.view:has(span[name="MyCustomer_List_Style_dlb"]) a[name^="Button "], .grid:has(span[name="MyCustomer_List_Style_dlb"]) a[name^="Button "]', function () {
        var $parent = $(this).closest('.view, .grid');
        $parent.find('a[name="Button All"], a[name="Button In Progress"], a[name="Button Need attention"], a[name="Button Completed"]').removeClass('active selected');
        $(this).addClass('active selected');
    });
});