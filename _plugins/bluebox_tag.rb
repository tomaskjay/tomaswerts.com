module Jekyll
  class BlueboxTag < Liquid::Block
    def initialize(tag_name, text, tokens)
      super
      @text = text
    end

    def render(context)
      # Render the inner content as Markdown
      site = context.registers[:site]
      converter = site.find_converter_instance(Jekyll::Converters::Markdown)
      content = super # Get the content inside the block
      rendered_content = converter.convert(content) # Convert Markdown to HTML

      # Wrap the rendered content in the bluebox div
      "<div class='bluebox'>#{rendered_content.strip}</div>"
    end
  end
end

Liquid::Template.register_tag('bluebox', Jekyll::BlueboxTag)
