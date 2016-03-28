module PaginationHelper

  def generate_pagination_json(page_num, per_page, resource, base_url)

    # Show href if there are more previous pages
    if page_num > 1
      prev_page_href = base_url + '?per_page=' + per_page.to_s + '&page_num=' + (page_num - 1).to_s
    else
      prev_page_href = ''
    end

    # Show href if there are more next pages
    if resource.total_pages == page_num || resource.total_pages == 0
      next_page_href = ''
    else
      next_page_href = base_url + '?per_page=' + per_page.to_s + '&page_num=' + (page_num + 1).to_s
    end

    return {
      :page_num => page_num,
      :total_pages => resource.total_pages,
      :total_count => resource.total_count,
      :next_page_href => next_page_href,
      :prev_page_href => prev_page_href
    }

  end

end


